/* global process */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var validator = require('validator');
var path = require('path');
var passwordHash = require('password-hash')
var config = require('./config');
var pwd = require('./pwd')
var db = require('./db/db')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(function (req, res, next) {
    console.log(`req.url:${req.url}`);
    console.log(`req.host:${req.host}`);
    console.log(`req.path:${req.path}`);
    console.log(`req.protocol:${req.protocol}`);
});

var createUserToken = function (user) {
    var token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: '90 days'
    });
    return token;
}

app.post("/api/auth", function (req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(401).send()
    }
    db.getUserByEmail(req.body.email, true)
        .then(user => {
            if (!user) {
                return res.status(401).send()
            }
            return pwd.verify(user.passwordHash, req.body.password)
                .then(isValid => {
                    if (isValid) {
                        return res.cookie('token', createUserToken(user)).send()
                    }
                    return res.status(401).send()
                })
        })
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
})

app.delete('/api/auth', function (req, res) {
    return res.cookie('token', '').status(200).send()
})

app.post('/api/users/', function (req, res) {
    db.getUserByEmail(req.body.email)
        .then(user => {
            if (user) {
                return res.status(409).send()
            }
            user = req.body;
            user.passwordHash = passwordHash.generate(req.body.password)
            db.insertUser(user)
                .then(res.send())
                .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
        })
});

app.use("/api/*", function (req, res, next) {
    var token = req.cookies.token || req.query.token || req.headers['authorization'] || '';
    token = token.replace('Bearer', '').trim();
    if (token) {
        jwt.verify(token, config.jwtSecret, function (err, decoded) {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token.' });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({ message: 'No token provided.' });
    }
});

app.get('/api/me', function (req, res) {
    db.getUserById(req.user.id)
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.put('/api/me', function (req, res) {
    db.updateUser(req.body)
        .then(res.send())
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.get('/api/users/:id', function (req, res) {
    db.getUserById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

// MARKER
app.get('/api/markers', function (req, res) {
    db.getMarkersByUser(req.user.id)
        .then(markers => res.json(markers))
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.post('/api/markers', function (req, res) {
    db.insertMarker(req.body)
        .then(res.send())
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.put('/api/markers', function (req, res) {
    db.updateMarker(req.body)
        .then(res.send())
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.delete('/api/markers/:id', function (req, res) {
    db.deleteMarker(req.params.id)
        .then(res.send())
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

// TEAM
app.get('/api/me/teams', function (req, res) {
    db.getTeamsByUser(req.user.id, req.query.activeOnly)
        .then(teams => res.json(teams))
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.post('/api/teams', function (req, res) {
    db.insertTeam(req.body)
        .then(res.send())
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.delete('/api/teams/:id', function (req, res) {
    db.deleteTeam(req.params.id)
        .then(res.send())
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
})

app.get('/api/teams/:id/members', function (req, res) {
    db.getTeamUsers(req.params.id)
        .then(members => res.json(members))
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.post('/api/teams/:id/invite', function (req, res) {
    if (!req.query.userEmail) {
        return res.status(400).send('userEmail is required.')
    }
    db.getUserByEmail(req.query.userEmail)
        .then(user => {
            if (!user) {
                return res.status(404).send()
            }
            return db.getTeamUsers(req.params.id)
                .then(users => {
                    console.log(users)
                    if (users && users.filter((user) => user.email === req.query.userEmail).length > 0) {
                        return res.status(409).send()
                    }
                    return db.insertTeamUser(req.params.id, user.id, 'invited')
                        .then(() => {
                            user.status = 'invited'
                            res.json(user)
                        })
                });
        })
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.post('/api/teams/:teamId/members/:userId/pause', function (req, res) {
    db.updateTeamUser(req.params.teamId, req.params.userId, 'paused')
        .then(res.send())
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.post('/api/teams/:teamId/members/:userId/activate', function (req, res) {
    db.updateTeamUser(req.params.teamId, req.params.userId, 'active')
        .then(res.send())
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});

app.delete('/api/teams/:teamId/members/:userId', function (req, res) {
    db.deleteTeamUser(req.params.teamId, req.params.userId)
        .then(res.send())
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
});



if (config.env !== 'production') {
    app.get('/appcache.mf', function (req, res) {
        return res.status(404).send()
    });
}
if (config.env === 'production') {
    app.use(express.static(path.join(__dirname, './public/dist')));
}
app.use(express.static(path.join(__dirname, './public')));

app.listen(config.port);
console.log('Running at http://localhost:' + config.port); 
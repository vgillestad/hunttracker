/* global process */
const express = require('express');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const validator = require("email-validator");
const jwt = require('jsonwebtoken');
const path = require('path');
const passwordHash = require('password-hash')
const nodemailer = require('nodemailer');
const config = require('./config');
const pwd = require('./pwd')
const db = require('./db/db')

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(function (req, res, next) {
    if (req.hostname && req.hostname.indexOf('hunttracker.no') > -1) {
        return res.redirect(301, config.publicBaseUrl);
    }
    else if (req.headers["x-forwarded-proto"] === 'http') {
        return res.redirect(301, config.publicBaseUrl);
    }
    next();
});

const createUserToken = ({ userId }) => {
    return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '90 days' });
}

const createPasswordResetToken = ({ userId }) => {
    return jwt.sign({ id: userId, scope: 'reset-password' }, config.jwtSecret, { expiresIn: '1 hours' });
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
                        res.cookie()
                        return res.cookie('token', createUserToken({ userId: user.id }), { maxAge: 86400000 * 90, httpOnly: false, sameSite: 'strict' }).send()
                    }
                    return res.status(401).send()
                })
        })
        .catch(err => res.status(500).json({ err: err && err.toString ? err.toString() : err }));
})

app.delete('/api/auth', function (req, res) {
    return res.cookie('token', '').status(200).send()
})

app.post('/api/users/send-reset-password-email', async (req, res) => {
    try {
        const user = await db.getUserByEmail(req.body.email);
        if (user) {
            const token = createPasswordResetToken({ userId: user.id });
            const resetPasswordUrl = `${config.publicBaseUrl}/reset-password.html#/?token=${token}`
            await nodemailer.createTransport({
                host: "mail.fastname.no",
                port: 465,
                secure: true,
                auth: {
                    user: 'support@hunttracker.no',
                    pass: 'Langbein83',
                },
            }).sendMail({
                from: '"HuntTracker Support" <support@hunttracker.no>',
                to: user.email,
                subject: "Reset Password",
                html: `
                    <h3>Hi ${user.firstName}</h3>
                    <p>You just sent us a request to reset your password. Follow the link below and you will be able to reset your new password.</p>
                    <p><small>${resetPasswordUrl}</p>
                    `,
            });
            return res.send()
        }
        return res.status(404).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
})

app.post('/api/users/reset-password', async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).send('password and confirmPassword does not match');
        }
        jwt.verify(token, config.jwtSecret, async function (err, decoded) {
            if (err) {
                return res.status(401).json({ message: 'invalid token' });
            } else {
                if (decoded.scope === 'reset-password') {
                    await db.updateUserPassword(decoded.id, passwordHash.generate(password))
                    return res.send();
                }
                return res.status(403).json({ message: 'provided token not allowed for password reset' });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
})

app.post('/api/users/', function (req, res) {
    const { email, password } = req.body;
    if (!validator.validate(email) || !password) {
        return res.status(400).json({ message: 'you need to provide an valid email and a password.' })
    }
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
    console.log(token);
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

if (config.env === 'production') {
    app.use(express.static(path.join(__dirname, './public/dist')));
}
app.use(express.static(path.join(__dirname, './public')));

app.listen(config.port);
console.log('Running at http://localhost:' + config.port);
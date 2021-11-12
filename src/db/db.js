var config = require('../config');

var pgp = require('pg-promise')();
var db = pgp({
    connectionString: config.postgresConnection,
    ssl: config.env === 'production'
        ? {
            rejectUnauthorized: false
        }
        : null
});
var queries = require('./queries');

// USER
module.exports.getUserById = function (userId) {
    return db.one(queries.GET_USER_BY_ID, [userId])
        .then(user => {
            delete user.passwordHash;
            return user;
        });
}

module.exports.getUserByEmail = function (email, includePasswordHash) {
    return db.oneOrNone(queries.GET_USER_BY_EMAIL, [email])
        .then(user => {
            if (user && !includePasswordHash) {
                delete user.passwordHash
            }
            return user;
        });
}

module.exports.updateUser = function (user) {
    return db.none(queries.UPD_USER, [user.settings, user.filters, user.id])
}

module.exports.insertUser = function (user) {
    return db.none(queries.INSERT_USER, [user.firstName, user.lastName, user.email, user.passwordHash])
}

module.exports.updateUserPassword = function (userId, passwordHash) {
    return db.none(queries.UPDATE_USER_PASSWORD, [passwordHash, userId])
}

// MARKER
module.exports.getMarkersByUser = function (userId) {
    return db.each(queries.GET_MARKERS, [userId], x => {
        x.coordinates = [x.lat, x.lon];
        x.sharedWithTeamIds = x.sharedWithTeamIds || []
    });
}

module.exports.insertMarker = function (marker) {
    return db.tx(t => {
        var q = [
            t.none(queries.INSERT_MARKER, [marker.id, marker.userId, marker.description, marker.dateTime, marker.icon, marker.coordinates[0], marker.coordinates[1]])
        ];
        if (marker.sharedWithTeamIds && marker.sharedWithTeamIds.length > 0) {
            marker.sharedWithTeamIds.forEach(teamId => {
                q.push(t.none(queries.INSERT_MARKER_TEAM, [marker.id, teamId]))
            });
        }
        return t.batch(q);
    })
}

module.exports.updateMarker = function (marker) {
    return db.one(queries.GET_MARKER_BY_ID, [marker.id])
        .then((currentMarker) => {
            return db.tx(function (t) {
                var q = [
                    //Update marker
                    t.none(queries.UPDATE_MARKER, [marker.id, marker.userId, marker.description, marker.dateTime, marker.icon, marker.coordinates[0], marker.coordinates[1]])
                ]
                marker.sharedWithTeamIds = marker.sharedWithTeamIds || []
                currentMarker.sharedWithTeamIds = currentMarker.sharedWithTeamIds || []

                marker.sharedWithTeamIds.forEach(teamId => {
                    if (currentMarker.sharedWithTeamIds.indexOf(teamId) < 0) {
                        //Insert marker_team
                        q.push(t.none(queries.INSERT_MARKER_TEAM, [marker.id, teamId]));
                    }
                });
                currentMarker.sharedWithTeamIds.forEach(teamId => {
                    if (marker.sharedWithTeamIds.indexOf(teamId) < 0) {
                        //Delete marker_team
                        q.push(t.none(queries.DELETE_MARKER_TEAM, [marker.id, teamId]));
                    }
                });
                return t.batch(q);
            });
        });
}

module.exports.deleteMarker = function (markerId) {
    return db.tx(function (t) {
        var q = [
            t.none(queries.DELETE_MARKER_TEAM_BY_MARKER, [markerId]),
            t.none(queries.DELETE_MARKER, [markerId])
        ]
        return t.batch(q);
    });
}

// TEAM
module.exports.getTeamsByUser = function (userId, activeOnly) {
    var query = activeOnly ? queries.GET_TEAMS_ACTIVE : queries.GET_TEAMS;
    return db.manyOrNone(query, [userId])
}

module.exports.insertTeam = function (team) {
    return db.tx(function (t) {
        var q = [
            t.none(queries.INSERT_TEAM, [team.id, team.adminId, team.name, team.description]),
            t.none(queries.INSERT_TEAM_USER, [team.id, team.adminId, 'admin'])
        ]
        return t.batch(q);
    });
}

module.exports.deleteTeam = function (teamId) {
    return db.tx(function (t) {
        var q = [
            db.none(queries.DELETE_MARKER_TEAM_BY_TEAM, [teamId]),
            db.none(queries.DELETE_TEAM_USER_BY_TEAM, [teamId]),
            db.none(queries.DELETE_TEAM, [teamId])
        ]
        return t.batch(q)
    });
}

// TEAM USER
module.exports.getTeamUsers = function (teamId) {
    return db.manyOrNone(queries.GET_TEAM_MEMBERS, [teamId])
}

module.exports.insertTeamUser = function (teamId, userId, status) {
    return db.none(queries.INSERT_TEAM_USER, [teamId, userId, status])
}

module.exports.updateTeamUser = function (teamId, userId, status) {
    return db.none(queries.UPDATE_TEAM_USER, [teamId, userId, status])
}

module.exports.deleteTeamUser = function (teamId, userId) {
    return db.none(queries.DELETE_TEAM_USER, [teamId, userId])
}

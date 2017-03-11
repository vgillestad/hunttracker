var config = {};
try {
    config = require('../config.json');
} catch (error) { }

config.port = process.env.PORT || config.port || 3000;
config.env = process.env.NODE_ENV || config.env || 'dev'
config.jwtSecret = process.env.JWT_SECRET || config.jwtSecret;
config.postgresConnection = process.env.POSTGRES_CONNECTION || config.postgresConnection

module.exports = config;
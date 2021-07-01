var config = {};
try {
    config = require('../config.json');
} catch (error) { }

config.port = process.env.PORT || config.port || 3000;
config.env = process.env.NODE_ENV || config.env || 'production'
config.jwtSecret = process.env.JWT_SECRET || config.jwtSecret;
config.publicBaseUrl = config.publicBaseUrl || "https://hunttracker.herokuapp.com"
config.postgresConnection = process.env.POSTGRES_CONNECTION || process.env.DATABASE_URL || config.postgresConnection;
config.postgresConnection = `${config.postgresConnection}?ssl=true`;

module.exports = config;
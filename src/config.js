var config = {};
try {
    config = require('../config.json');
} catch (error) { }

config.port = process.env.PORT || config.port || 3000;
config.jwtSecret = process.env.JWT_SECRET || config.jwtSecret;

module.exports = config;
const CONFIG = require(`./${process.env.NODE_ENV || 'development'}`);

module.exports = CONFIG;

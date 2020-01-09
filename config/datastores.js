const CONFIG  = require(`./env`);

module.exports.datastores = {
  default: {
    adapter: 'sails-mongo',
    url    : `mongodb://${CONFIG.mongo.user}:${CONFIG.mongo.password}@${CONFIG.mongo.host}:${CONFIG.mongo.port}/${CONFIG.mongo.database}`
  }
};

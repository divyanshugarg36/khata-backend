const CONFIG  = require(`./env`);

module.exports.datastores = {
  default: {
    adapter: 'sails-mongo',
    url    : `${CONFIG.mongoURL}`
  }
};

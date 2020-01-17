const jwt = require('jsonwebtoken');

module.exports = (headers) => {
  try {
    if(headers.authorization) {
      const token = headers.authorization;
      return jwt.verify(token, sails.config.secret, (err, token) => {
        return {
          success: !err,
          user: token
        };
      });
    }
  } catch (err) {
    return {
      error: err,
      success: false,
    };
  }
};

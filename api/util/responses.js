const { ERROR_INFO } = require('../const/errorInfo');

module.exports = {
  sendBadRequest: (res, err) => {
    res.badRequest({
      type: err,
      info: ERROR_INFO[err]
    });
  }
};

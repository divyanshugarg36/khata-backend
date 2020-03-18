const { ERROR_TYPES } = require('../const/errorTypes');

module.exports = (res, err) => {
  res.badRequest({
    type: _.invert(ERROR_TYPES)[err],
    info: err
  });
};


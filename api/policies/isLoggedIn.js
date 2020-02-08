const { sendBadRequest, verifyToken } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');
const { ACCESS_FORBIDDEN } = ERROR_TYPES;

module.exports = async function (req, res, proceed) {
  try {
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }
    req.body.user = verified.user;
    return proceed();
  } catch (err) {
    res.serverError(err);
  }
};
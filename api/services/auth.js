const passport = require('passport');
const jwt = require('jsonwebtoken');
const { sendBadRequest, verifyToken } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACCESS_FORBIDDEN, DATA_MISSING } = ERROR_TYPES;

const login = (req, res) => {
  passport.authenticate('local', (err, user, data) => {
    if (err) {
      return res.serverError(err);
    }
    else if (data) {
      return res.badRequest(data);
    }
    else if (user) {
      const token = jwt.sign(user, sails.config.secret, { expiresIn: sails.config.expiresIn });
      req.session.cookie.token = token;
      return res.send({
        success: true,
        user,
        token
      });
    }
  })(req, res);
};

const verifyPassword = async (req, res) => {
  try {
    const verified = verifyToken(req.headers);
    if(!verified || !verified || !verified.success) {
      res.send(verified);
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { body: data } = req;
    if(!data.password) {
      return res.sendBadRequest(res, DATA_MISSING);
    }

    req.body.username = verified.user.username;
    login(req, res);

  } catch (err) {
    res.serverError(err);
  }
};

module.exports = {
  login,
  verifyPassword
};

const passport = require('passport');
const jwt = require('jsonwebtoken');
const { sendBadRequest } = require('../util/responses');
const { ERROR_TYPES } = require('../const/errorTypes');

const { INVALID_TOKEN } = ERROR_TYPES;

module.exports = {
  login: function(req, res) {
    console.log(req);
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
  },

  verifyToken: async (req, res) => {
    try {
      const { token } = req.body;
      jwt.verify(token, sails.config.secret, (err, token) => {
        if(err) {
          return sendBadRequest(res, INVALID_TOKEN);
        }
        res.send({
          success: true,
          token
        });
      });
    } catch (err) {
      res.serverError(err);
    }
  },
};

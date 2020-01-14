const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = {
  login: function(req, res) {
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
  }
};

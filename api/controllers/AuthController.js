const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = {
  login: function(req, res) {
    passport.authenticate('local', (err, user) => {
      if (err || !user) {
        return res.send({
          info: 'failure'
        });
      }
      req.logIn(user, err => {
        if (err) {
          res.send({info: err});
        }
        const token = jwt.sign(user, sails.config.secret, { expiresIn: sails.config.expiresIn });
        req.session.cookie.token = token;
        return res.send({
          info: 'success',
          user,
          token
        });
      });
    })(req, res);
  },
  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  }
};

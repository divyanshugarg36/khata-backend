const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const { ERROR_TYPES } = require('../api/const/errorTypes');

const { USER_NOT_FOUND, INCORRECT_PASSWORD } = ERROR_TYPES;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findOne({ id }, (err, users) => {
    done(err, users);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err, null);
        }
        if (!user || user.role != 'admin') {
          return done(null, null, {
            type: USER_NOT_FOUND,
            info: 'User not found!',
            success: false,
          });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (err || !res) {
            return done(null, null, {
              type: INCORRECT_PASSWORD,
              info: 'Password is incorrect!',
              success: false,
            });
          } else {
            return done(null, user);
          }
        });
      });
    }
  )
);

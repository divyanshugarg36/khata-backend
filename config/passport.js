const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

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
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: 'Username not found' });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (err) {
            return done(null, false, { message: 'Error: ' + err.message });
          }
          if (!res) {
            return done(null, false, { message: 'Invalid Password' });
          }
          let userDetails = {
            email: user.email,
            username: user.username,
            id: user.id
          };
          return done(null, userDetails, { message: 'Login Succesful' });
        });
      });
    }
  )
);

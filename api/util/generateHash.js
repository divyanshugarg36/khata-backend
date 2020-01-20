const bcrypt = require('bcrypt-nodejs');

module.exports = (password, done) => {
  bcrypt.genSalt(10, (err, salt) => {
    if(err) {return done(err);}
    bcrypt.hash(password, salt, null, (err, hash) => {
      if(err) {return done(err);}
      done(null, hash);
    });
  });
};

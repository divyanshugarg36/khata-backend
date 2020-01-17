const bcrypt = require('bcrypt-nodejs');

module.exports = (user, done) => {
  bcrypt.genSalt(10, (err, salt) => {
    if(err) {return done(err);}
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) {return done(err);}
      user.password = hash;
      return done();
    });
  });
};

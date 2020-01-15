const bcrypt = require('bcrypt-nodejs');

module.exports = {
  attributes: {
    email: {
      type: 'string',
      isEmail: true,
      required: true
    },
    username: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    role: {
      type: 'string',
      defaultsTo: 'member'
    },
    type: {
      type: 'string'
    }
  },
  customToJSON: function() {
    return _.omit(this, ['password']);
  },
  beforeCreate: function(user, done){
    bcrypt.genSalt(10, (err, salt) => {
      if(err) {return done(err);}
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if(err) {return done(err);}
        user.password = hash;
        return done();
      });
    });
  }
};

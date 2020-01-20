const { generateHash } = require('../util');

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
      defaultsTo: 'employee'
    }
  },

  customToJSON: function() {
    return _.omit(this, ['password']);
  },

  beforeCreate: function (user, done) {
    generateHash(user.password, (err, hash) => {
      if(err) {
        return done(err);
      }
      user.password = hash;
      done();
    });
  },
};

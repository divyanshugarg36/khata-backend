const { generateHash } = require('../util');

module.exports = {
  attributes: {
    email: {
      type: 'string',
      isEmail: true,
    },
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    active: {
      type: 'boolean',
      defaultsTo: true,
    },
    role: {
      type: 'string',
      defaultsTo: 'member',
    },
    toggl: {
      type: 'json',
      defaultsTo: {}
    },
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

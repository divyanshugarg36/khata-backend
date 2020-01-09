const jwt = require('jsonwebtoken');

module.exports = {
  register: async function(req, res) {
    try {
      const { email, password, username } = req.body;

      if(!email || !password || !username) {
        return res.badRequest({info: 'Data is Missing!'});
      }

      const result = await User.findOne({ email: email });
      if(result) {
        return res.badRequest({info: 'Email already exits!'});
      }

      const user = await User.create({ email, password, username }).fetch();

      const token = jwt.sign(user, sails.config.secret, { expiresIn: sails.config.expiresIn });
      req.session.cookie.token = token;
      res.send({
        info: 'success',
        user,
        token
      });
    } catch (err) {
      res.badRequest({info: err});
    }
  },
};


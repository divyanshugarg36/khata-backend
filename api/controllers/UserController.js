const jwt = require('jsonwebtoken');
const { sendBadRequest } = require('../util/responses');
const { ERROR_TYPES } = require('../const/errorTypes');

const { DATA_MISSING, EMAIL_ALREADY_USED, USERNAME_TAKEN, USER_NOT_FOUND } = ERROR_TYPES;
module.exports = {
  register: async (req, res) => {
    try {
      const { email, password, username } = req.body;

      if(!email || !username || !password){
        return sendBadRequest(res, DATA_MISSING);
      }

      const emailResult = await User.findOne({ email });
      if(emailResult) {
        return sendBadRequest(res, EMAIL_ALREADY_USED);
      }

      const userResult = await User.findOne({ username });
      if(userResult) {
        return sendBadRequest(res, USERNAME_TAKEN);
      }

      const user = await User.create({ email, password, username }).fetch();

      const token = jwt.sign(user, sails.config.secret, { expiresIn: sails.config.expiresIn });
      req.session.cookie.token = token;
      res.send({
        success: true,
        user,
        token
      });
    } catch (err) {
      res.serverError(err);
    }
  },

  fetch: async (req, res) => {
    try {
      const { email } = req.body;
      if(!email) {
        return sendBadRequest(res, DATA_MISSING);
      }

      const user = await User.findOne({ email });
      if(!user) {
        return sendBadRequest(res, USER_NOT_FOUND);
      }

      res.send({
        success: true,
        user
      });
    } catch (err) {
      res.serverError(err);
    }
  },
};


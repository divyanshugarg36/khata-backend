const passport = require('passport');
const jwt = require('jsonwebtoken');
const { sendBadRequest } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { DATA_MISSING } = ERROR_TYPES;

// To verify the username and password for login
const login = (req, res) => {
  passport.authenticate('local', (err, user, data) => {
    if (err) {
      return res.serverError(err);
    }
    else if (data) {
      return res.badRequest(data);
    }
    else if (user) {
      // If the user is logged in successfully, then
      // create a token and send it back to the client
      const token = jwt.sign(user, sails.config.secret, { expiresIn: sails.config.expiresIn });
      req.session.cookie.token = token;
      return res.send({
        success: true,
        user,
        token
      });
    }
  })(req, res);
};

// Verifies the correctness of password [ Needed while updating the profile ]
const verifyPassword = async (req, res) => {
  try {
    const { body: data } = req;
    const { user } = data;
    if(!data.password) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Simply perform the login function with that password... to verify if password works
    req.body.username = user.username;
    login(req, res);

  } catch (err) {
    res.serverError(err);
  }
};

module.exports = {
  login,
  verifyPassword
};

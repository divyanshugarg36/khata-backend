const jwt = require('jsonwebtoken');
const { generateHash, sendBadRequest, verifyToken } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACCESS_FORBIDDEN, DATA_MISSING, EMAIL_ALREADY_USED, USERNAME_TAKEN, USER_NOT_FOUND } = ERROR_TYPES;

// To get the details of user from email address
const fetch = async (req, res) => {
  try {
    //  Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    // Checks for email address in request
    const { email } = req.body;
    if(!email) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Get details of user
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
};

// Get details of all the user
const fetchAll = async (req, res) => {
  try {
    //  Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    // Get detail of all users
    const users = await User.find({});
    if(!users) {
      sendBadRequest(res, USER_NOT_FOUND);
    }

    res.send({
      success: true,
      users
    });
  } catch (err) {
    res.serverError(err);
  }
};

// To register a new user
const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Ensure if required data is provided
    if(!email || !username || !password){
      return sendBadRequest(res, DATA_MISSING);
    }

    // To check if email address already exists
    const emailResult = await User.findOne({ email });
    if(emailResult) {
      return sendBadRequest(res, EMAIL_ALREADY_USED);
    }

    // To check if username is already taken
    const userResult = await User.findOne({ username });
    if(userResult) {
      return sendBadRequest(res, USERNAME_TAKEN);
    }

    const user = await User.create({ email, password, username }).fetch();

    // Create token of the user & send it back to client
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
};

// Updating details of the user
const update = async (req, res) => {
  try {
    //  Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }
    
    const { name, email, username, newPassword } = req.body;
    
    // To check if email address already exists
    const emailResult = await User.findOne({ email });
    if(emailResult) {
      return sendBadRequest(res, EMAIL_ALREADY_USED);
    }
    
    // To check if username is already taken
    const userResult = await User.findOne({ username });
    if(userResult) {
      return sendBadRequest(res, USERNAME_TAKEN);
    }
    
    const data = {
      name,
      email,
      username,
      password: newPassword
    };
    
    // Generate the hash of new password
    generateHash(data.password, async (err, hash) => {
      if(err) {
        return false;
      }
      data.password = hash;

      // Update the details of user
      const user = await User.updateOne({ id: verified.user.id }).set(data);
      if(!user) {
        return sendBadRequest(res, USER_NOT_FOUND);
      }
      res.send({
        success: true,
        user
      });
    });
  } catch (err) {
    res.serverError(err);
  }
};

module.exports = {
  fetch,
  fetchAll,
  register,
  update,
};

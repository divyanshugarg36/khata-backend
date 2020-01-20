const jwt = require('jsonwebtoken');
const { generateHash, sendBadRequest, verifyToken } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACCESS_FORBIDDEN, DATA_MISSING, EMAIL_ALREADY_USED, USERNAME_TAKEN, USER_NOT_FOUND } = ERROR_TYPES;

// To fetch the details of a user
const fetch = async (req, res) => {
  try {
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

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
};

// To fetch the list of all users with their details
const fetchAll = async (req, res) => {
  try {
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

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

// To register a new user in database
const register = async (req, res) => {
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

    console.log(user);

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

// To update the details of the user
const update = async (req, res) => {
  const verified = verifyToken(req.headers);
  if(!verified || !verified.success) {
    return sendBadRequest(res, ACCESS_FORBIDDEN);
  }

  const { email, username, newPassword } = req.body;
  const data = {
    email,
    username,
    password: newPassword
  };

  generateHash(data.password, async (err, hash) => {
    if(err) {
      return false;
    }
    data.password = hash;
    const user = await User.updateOne({ id: verified.user.id }).set(data);
    if(!user) {
      return sendBadRequest(res, USER_NOT_FOUND);
    }
    res.send({
      success: true,
      user
    });
  });

};

module.exports = {
  fetch,
  fetchAll,
  register,
  update,
};

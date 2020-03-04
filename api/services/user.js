const jwt = require('jsonwebtoken');
const { generateHash, sendBadRequest } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { DATA_MISSING, EMAIL_ALREADY_USED, USERNAME_TAKEN, USER_NOT_FOUND } = ERROR_TYPES;

// To add a new member 
const addMember = async (req, res) => {
  try {
    const { username, name, email } = req.body;
    if(!name || !username) {
      return sendBadRequest(res, DATA_MISSING);
    }

    const userResult = await User.findOne({ username });
    if(userResult) {
      return sendBadRequest(res, USERNAME_TAKEN);
    }

    const emailResult = await User.findOne({ email });
    if(emailResult) {
      return sendBadRequest(res, EMAIL_ALREADY_USED);
    }

    const user = await User.create({ username, name, email }).fetch();
    res.send({
      success: true,
      user
    });
  } catch (err) {
    res.serverError(err);
  }
}

// To remove a member
const remove = async (req, res) => {
  try {
    // Send the bad request if ID not found in request
    const { id } = req.body;
    if(!id) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Deletes the project and get all its details
    const member = await User.findOne({ id, role: 'member' });
    if(!member) {
      return sendBadRequest(res, NOT_FOUND);
    }
    await User.destroy({ id, role: 'member'});

    res.send({
      success: true,
    });
  } catch (err) {
    res.serverError(err);
  }
};


// To get the details of user from email address
const fetch = async (req, res) => {
  try {
    // Checks for email address in request
    const { id } = req.body;
    if(!id) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Get details of user
    const user = await User.findOne({ id });
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
    // Get detail of all users
    const users = await User.find({ role: 'member' });
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

// To register a new admin user
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
    const { id, name, email, username, newPassword, user } = req.body;

    const userId = id || user.id;
    const userData = await User.findOne({ id: userId });

    // To check if email address already exists
    const emailResult = await User.findOne({ email });
    if(emailResult && email !== userData.email) {
      return sendBadRequest(res, EMAIL_ALREADY_USED);
    }
    
    // To check if username is already taken
    const userResult = await User.findOne({ username });
    if(userResult && username !== userData.username) {
      return sendBadRequest(res, USERNAME_TAKEN);
    }
    
    const data = {
      name,
      email,
      username,
      password: newPassword || ' '
    };
    
    // Generate the hash of new password
    generateHash(data.password, async (err, hash) => {
      if(err) {
        return false;
      }
      data.password = hash;

      if (!newPassword) {
        delete data.password;
      }

      // Update the details of user
      const user = await User.updateOne({ id: userId }).set(data);
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
  addMember,
  remove,
  fetch,
  fetchAll,
  register,
  update,
};

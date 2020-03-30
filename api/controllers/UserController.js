const jwt = require('jsonwebtoken');
const { generateHash, sendBadRequest } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');
const { DATA_MISSING, EMAIL_ALREADY_USED, USERNAME_TAKEN, USER_NOT_FOUND } = ERROR_TYPES;

module.exports = {
  // To create a new member
  createMember: async (req, res) => {
    try {
      const { username, name, email, toggl } = req.body;
      if(!name || !username || !email) {
        return sendBadRequest(res, DATA_MISSING);
      }

      const userResult = await User.findOne({ username, active: true });
      if(userResult) {
        return sendBadRequest(res, USERNAME_TAKEN);
      }

      const emailResult = await User.findOne({ email, active: true });
      if(emailResult) {
        return sendBadRequest(res, EMAIL_ALREADY_USED);
      }

      const user = await User.create({ username, name, email, toggl }).fetch();
      res.send({
        success: true,
        user
      });
    } catch (err) {
      res.serverError(err);
    }
  },

  // To remove a member
  deleteMember: async (req, res) => {
    try {
      // Send the bad request if ID not found in request
      const { id } = req.body;
      if(!id) {
        return sendBadRequest(res, DATA_MISSING);
      }

      const member = await User.findOne({ id, role: 'member' });
      if(!member) {
        return sendBadRequest(res, NOT_FOUND);
      }
      member.active = false;
      await User.updateOne({ id, role: 'member'}).set(member);

      res.send({
        success: true,
      });
    } catch (err) {
      res.serverError(err);
    }
  },


  // To get the details of user from email address
  fetchUser: async (req, res) => {
    try {
      // Checks for ID in request
      const { id, user } = req.body;
      const userId = id || user.id;

      // Get details of user
      const result = await User.findOne({ id: userId, active: true });
      if(!result) {
        return sendBadRequest(res, USER_NOT_FOUND);
      }

      res.send({
        success: true,
        user: result,
      });
    } catch (err) {
      res.serverError(err);
    }
  },

  // Get details of all the members
  fetchAllMembers: async ({}, res) => {
    try {
      const users = await User.find({ role: 'member', active: true });
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
  },

  // To register a new admin user
  register: async (req, res) => {
    try {
      const { email, password, username } = req.body;

      // Ensure if required data is provided
      if(!email || !username || !password){
        return sendBadRequest(res, DATA_MISSING);
      }

      // To check if email address already exists
      const emailResult = await User.findOne({ email, active: true });
      if(emailResult) {
        return sendBadRequest(res, EMAIL_ALREADY_USED);
      }

      // To check if username is already taken
      const userResult = await User.findOne({ username, active: true });
      if(userResult) {
        return sendBadRequest(res, USERNAME_TAKEN);
      }

      const user = await User.create({ email, password, username, role: 'admin' }).fetch();

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
  },

  // Updating details of the user
  updateProfile: async (req, res) => {
    try {
      const { id, name, email, username, toggl, user } = req.body;
      const userId = id || user.id;
      const userData = await User.findOne({ id: userId, active: true });

      const emailResult = await User.findOne({ email, active: true });
      if(emailResult && email !== userData.email) {
        return sendBadRequest(res, EMAIL_ALREADY_USED);
      }
      const userResult = await User.findOne({ username, active: true });
      if(userResult && username !== userData.username) {
        return sendBadRequest(res, USERNAME_TAKEN);
      }
      const data = { name, email, username, toggl };

      const result = await User.updateOne({ id: userId, active: true }).set(data);
      res.send({
        success: true,
        user: result
      });
    } catch (err) {
      res.serverError(err);
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { password, user } = req.body;
      generateHash(password, async (err, hash) => {
        if(err) {
          return false;
        }
        const result = await User.updateOne({ id: user.id, active: true }).set({password: hash});
        res.send({
          success: true,
          user: result
        });
      });
    } catch (err) {
      res.serverError(err);
    }
  },
};

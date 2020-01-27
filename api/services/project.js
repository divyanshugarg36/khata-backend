const { sendBadRequest, verifyToken } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');
const { create: createAssignment, view: viewAssignment, unassign } = require('./assignment');

const { ACCESS_FORBIDDEN, DATA_MISSING, MEMBER_ALREADY_ADDED, NOT_FOUND, USER_NOT_FOUND } = ERROR_TYPES;

// To create a new project by the admin
const create = async (req, res) => {
  try {
    // Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { body: data } = req;
    if(!data.name) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Set current logged in user as the admin of project
    data.contributors = {
      admin: verified.user.id,
      members: [],
    };

    // Creates the project now
    const { name, description, contributors } = data;
    const project = await Project.create({ name, description, contributors }).fetch();

    // Data required for the assignment
    req.body = {
      user: data.contributors.admin,
      project: project.id,
      price: data.price,
      type: data.type,
    };
    // After creating project, create the assignment as well
    createAssignment(req, res, true, project);

  } catch (err) {
    res.serverError(err);
  }
};

// To view the details of an individual project
const view = async (req, res) => {
  try {
    // Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    // Check if ID exits in the request
    const { id } = req.body;
    if(!id) {
      return sendBadRequest(res, DATA_MISSING);
    }
    
    // Send bad request if project not found
    const project = await Project.findOne({ id });
    if(!project) {
      return sendBadRequest(res, NOT_FOUND);
    }

    let { admin, members } = project.contributors;
    if(members.length === 0) {
      members = [''];
    }
    // Get the details of admin of project
    project.contributors.admin = await User.findOne({ id: admin });

    // Get the details of the all members in project
    members.forEach(async (id, index) => {
      if(id) {
        const user = await User.findOne({ id });
        project.contributors.members[index] = user;
      }

      if(index === (members.length - 1)) {
        const data = {
          user: verified.user.id,
          project,
        };

        // View the assignment details of project as well
        viewAssignment(req, res, data);
      }
    });

  } catch (err) {
    res.serverError(err);
  }
};

// To update the details of a project
const update = async (req, res) => {
  try {
    //  Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    // Send bad request if ID not found in request
    const { body: data } = req;
    if(!data.id) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Update the details of the project
    const project = await Project.updateOne({ id: data.id }).set(data);
    if(!project) {
      return sendBadRequest(res, NOT_FOUND);
    }

    // Send back the new details of project
    res.send({
      success: true,
      project
    });
  } catch (err) {
    res.serverError(err);
  }
};

// To remove a project
const remove = async (req, res) => {
  try {
    //  Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    // Send the bad request if ID not found in request
    const { id } = req.body;
    if(!id) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Deletes the project and get all its details
    const project = await Project.destroy({ id }).fetch();
    if(!project) {
      return sendBadRequest(res, NOT_FOUND);
    }

    req.body = {
      user: verified.user.id,
      project: id
    };
    // Remove the project from assignments as well
    unassign(req, res);

    res.send({
      success: true,
      project
    });
  } catch (err) {
    res.serverError(err);
  }
};

// Get the details of all project and assignments of a user
const fetchAll = async (req, res) => {
  try {
    //  Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    // Get the details of all assignments, project of specified user
    const user = req.body.user || verified.user.id;
    const assignments = await Assignment.find({ user, active: true });
    for(let key in assignments) {
      assignments[key].project = await Project.findOne({ id: assignments[key].project });
    }
    res.send({
      success: true,
      assignment: assignments
    });
  } catch (err) {
    res.serverError(err);
  }
};

// Adding a new member in the project
const addMember = async (req, res) => {
  try {
    //  Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { user, project, price } = req.body;
    if(!user || !price) {
      return sendBadRequest(res, DATA_MISSING);
    }

    const userResult = await User.findOne({ username: user });
    if(!userResult) {
      return sendBadRequest(res, USER_NOT_FOUND);
    }

    // Check if user is already the member of this project
    const data = await Project.findOne({ id: project });
    if(data.contributors.members.includes(userResult.id)) {
      return sendBadRequest(res, MEMBER_ALREADY_ADDED);
    }

    // Otherwise add it to the members of project
    data.contributors.members.push(userResult.id);
    req.body.user = userResult.id;

    const result = await Project.updateOne({ id: project }).set(data);

    let { admin, members } = result.contributors;
    if(members.length === 0) {
      members = [''];
    }
    // Get details of the admin of project ... for sending it in response
    result.contributors.admin = await User.findOne({ id: admin });
    members.forEach(async (id, index) => {
      if(id) {
        const user = await User.findOne({ id });
        result.contributors.members[index] = user;
      }
      // Create a new assignment for this new member
      if(index === (members.length - 1)) createAssignment(req, res, true, result);
    });

  } catch (err) {
    res.serverError(err);
  }
};

// To remove a member from the project
const removeMember = async (req, res) => {
  try {
    //  Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { user, project } = req.body;
    if(!user || !project) {
      return sendBadRequest(res, DATA_MISSING);
    }

    const result = await Project.findOne({ id: project });
    if(!result) {
      return sendBadRequest(res, NOT_FOUND);
    }
    // Remove the user from members list
    result.contributors.members.splice(result.contributors.members.indexOf(user), 1);

    // Update the project details
    await Project.updateOne({ id: project }).set(result);

    // Remove the assignment of user
    unassign(req, res);
    
    res.send({
      success: true
    });
  } catch(err) {
    res.serverError(err);
  }
}

module.exports = {
  create,
  view,
  update,
  remove,
  fetchAll,
  addMember,
  removeMember,
};


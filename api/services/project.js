const { sendBadRequest } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACTION_FAILED, DATA_MISSING, MEMBER_ALREADY_ADDED, NOT_FOUND, USER_NOT_FOUND } = ERROR_TYPES;

// To create a new project
const create = async (req, res) => {
  try {
    const { name, description, client, role, togglId } = req.body;
    if(!name || !description || !client || !role) {
      return sendBadRequest(res, DATA_MISSING);
    }

    const project = await Project.create({ name, description, client, role, togglId }).fetch();
    if(!project) {
      return sendBadRequest(res, ACTION_FAILED);
    }

    res.send({
      success: true,
      project
    });

  } catch (err) {
    res.serverError(err);
  }
};

// To view the details of an individual project
const view = async (req, res) => {
  try {
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
    const users = await User.find({ role: 'member' });
    project.assignments = project.assignments.filter(a => a.active);
    project.assignments.forEach((a) => {
      const user = users.find((u) => u.id === a.id);
      a.name = user.name;
      a.username = user.username;
    });

    res.send({
      success: true,
      project,
    });
  } catch (err) {
    res.serverError(err);
  }
};

// To update the details of a project
const update = async (req, res) => {
  try {
    // Send bad request if ID not found in request
    const { id, data } = req.body;
    if(!id || !data) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Update the details of the project
    const project = await Project.updateOne({ id }).set(data);
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
    // Send the bad request if ID not found in request
    const { id } = req.body;
    if(!id) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Deletes the project and get all its details
    const project = await Project.findOne({ id, active: true });
    if(!project) {
      return sendBadRequest(res, NOT_FOUND);
    }
    project.active = false;
    await Project.updateOne({ id, active: true}).set(project);

    res.send({
      success: true,
      project
    });
  } catch (err) {
    res.serverError(err);
  }
};

// Get the details of all projects of a user
const fetchAll = async (req, res) => {
  try {
    const projects = await Project.find({ active: true });
    res.send({
      success: true,
      projects
    });
  } catch (err) {
    res.serverError(err);
  }
};

// Adding a new member in the project
const addMember = async (req, res) => {
  try {
    const { username, project, price, type, role } = req.body;
    if(!project || !user || !price || !type || !role) {
      return sendBadRequest(res, DATA_MISSING);
    }
    const userResult = await User.findOne({ username, role: 'member', active: true });
    if(!userResult) {
      return sendBadRequest(res, USER_NOT_FOUND);
    }

    // Check if user is already the member of this project
    const data = await Project.findOne({ id: project, active: true });
    for (let i = 0; i < data.assignments.length; i++) {
      let item = data.assignments[i];
      if(item.active && item.id === userResult.id) {
        return sendBadRequest(res, MEMBER_ALREADY_ADDED);
      }
    }

    // Adds a new assignment
    data.assignments.push({
      id: userResult.id,
      role,
      price,
      type,
      active: true,
      createdAt: new Date()
    });

    // Update the project
    const result = await Project.updateOne({ id: project, active: true }).set(data);
    req.body.id = result.id;
    view(req, res);

  } catch (err) {
    res.serverError(err);
  }
};

// To remove a member from the project
const removeMember = async (req, res) => {
  try {
    const { userId, project } = req.body;
    if(!userId || !project) {
      return sendBadRequest(res, DATA_MISSING);
    }

    const result = await Project.findOne({ id: project, active: true });
    if(!result) {
      return sendBadRequest(res, NOT_FOUND);
    }
    result.assignments.forEach((item, key) => {
      if(item.id === userId) {
        result.assignments[key].active = false;
        result.assignments[key].unassignedAt = new Date();
      }
    });

    await Project.updateOne({ id: project }).set(result);
    res.send({
      success: true
    });
  } catch(err) {
    res.serverError(err);
  }
};

module.exports = {
  create,
  view,
  update,
  remove,
  fetchAll,
  addMember,
  removeMember,
};

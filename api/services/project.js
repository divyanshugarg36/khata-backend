const { sendBadRequest } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACTION_FAILED, DATA_MISSING, MEMBER_ALREADY_ADDED, NOT_FOUND, USER_NOT_FOUND } = ERROR_TYPES;

// To create a new project
const create = async (req, res) => {
  try {
    const { name, description, client, role } = req.body;
    if(!name || !description || !client || !role) {
      return sendBadRequest(res, DATA_MISSING);
    }

    const project = await Project.create({ name, description, client, role }).fetch();
    if(!project) {
      return sendBadRequest(res, ACTION_FAILED)
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
    const { id, user } = req.body;
    if(!id) {
      return sendBadRequest(res, DATA_MISSING);
    }
    
    // Send bad request if project not found
    const project = await Project.findOne({ id });
    if(!project) {
      return sendBadRequest(res, NOT_FOUND);
    }

    project.assignments = project.assignments.filter(a => {
      return (a.active);
    });
    fetchUserNames(project).then(() => {
      res.send({
        success: true,
        project,
      });
    });
  } catch (err) {
    res.serverError(err);
  }
};

// To update the details of a project
const update = async (req, res) => {
  try {
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

// Gets the details of all members in project... and returns the project with member details
const fetchUserNames = (project) => {
  return new Promise((resolve) => {
    let result = project;
    let { assignments } = result;
    if(assignments.length === 0) {
      assignments = [''];
    }
    const requests = [];
    
    // Adds details of each member 
    assignments.forEach((item, index) => {
      if(item) {
        requests.push(
          new Promise((res) => {
            const { id } = item;
            User.findOne({ id }).then((data) => {
              const { name, username } = data;
              assignments[index].name = name;
              assignments[index].username = username;
              res();
            });
          })
        );
      } 
    });
    // Sends response back, when all details are fetched
    Promise.all(requests).then(() => {
      resolve(result);
    });
  });
};

// Get the details of all projects of a user
const fetchAll = async (req, res) => {
  try {
    const { user } = req.body;
    // Get the details of projects
    const userId = user.id;
    const projects = await Project.find({ active: true });
    const requests = [];

    // Get details of all members in project
    Object.keys(projects).forEach((key) => {
      requests.push(
        fetchUserNames(projects[key])
        .then((data) => {
          projects[key] = data;
        })
      );
    });

    // Send response back when details are fetched
    Promise.all(requests).then(() => {
      res.send({
        success: true,
        projects
      });
    });
  } catch (err) {
    res.serverError(err);
  }
};

// Adding a new member in the project
const addMember = async (req, res) => {
  try {
    const { username, project, price, type } = req.body;
    if(!project || !user || !price || !type) {
      return sendBadRequest(res, DATA_MISSING);
    }
    const userResult = await User.findOne({ username, role: 'member' });
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

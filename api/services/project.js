const { sendBadRequest, verifyToken } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');
const { create: createAssignment, view: viewAssignment, unassign } = require('./assignment');

const { ACCESS_FORBIDDEN, DATA_MISSING, MEMBER_ALREADY_ADDED, NOT_FOUND, USER_NOT_FOUND } = ERROR_TYPES;

const create = async (req, res) => {
  try {
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { body: data } = req;
    if(!data.name) {
      return sendBadRequest(res, DATA_MISSING);
    }

    data.contributors = {
      admin: verified.user.id,
      members: [],
    };

    const { name, description, contributors } = data;
    const project = await Project.create({ name, description, contributors }).fetch();

    req.body = {
      user: data.contributors.admin,
      project: project.id,
      price: data.price,
      type: data.type,
    };
    createAssignment(req, res, true, project);

  } catch (err) {
    res.serverError(err);
  }
};

const view = async (req, res) => {
  try {
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { id } = req.body;
    if(!id) {
      return sendBadRequest(res, DATA_MISSING);
    }
    
    const project = await Project.findOne({ id });
    if(!project) {
      return sendBadRequest(res, NOT_FOUND);
    }

    let { admin, members } = project.contributors;
    if(members.length === 0) {
      members = [''];
    }
    project.contributors.admin = await User.findOne({ id: admin });
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
        viewAssignment(req, res, data);
      }
    });

  } catch (err) {
    res.serverError(err);
  }
};

const update = async (req, res) => {
  try {
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { body: data } = req;
    if(!data.id) {
      return sendBadRequest(res, DATA_MISSING);
    }

    const project = await Project.updateOne({ id: data.id }).set(data);
    if(!project) {
      return sendBadRequest(res, NOT_FOUND);
    }

    res.send({
      success: true,
      project
    });
  } catch (err) {
    res.serverError(err);
  }
};

const remove = async (req, res) => {
  try {
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { id } = req.body;
    if(!id) {
      return sendBadRequest(res, DATA_MISSING);
    }

    const project = await Project.destroy({ id }).fetch();
    if(!project) {
      return sendBadRequest(res, NOT_FOUND);
    }

    res.send({
      success: true,
      project
    });
  } catch (err) {
    res.serverError(err);
  }
};

const fetchAll = async (req, res) => {
  try {
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

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

const addMember = async (req, res) => {
  try {
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

    const data = await Project.findOne({ id: project });
    if(data.contributors.members.includes(userResult.id)) {
      return sendBadRequest(res, MEMBER_ALREADY_ADDED);
    }
    data.contributors.members.push(userResult.id);
    req.body.user = userResult.id;

    const result = await Project.updateOne({ id: project }).set(data);

    let { admin, members } = result.contributors;
    if(members.length === 0) {
      members = [''];
    }
    result.contributors.admin = await User.findOne({ id: admin });
    members.forEach(async (id, index) => {
      if(id) {
        const user = await User.findOne({ id });
        result.contributors.members[index] = user;
      }

      if(index === (members.length - 1)) createAssignment(req, res, true, result);
    });

  } catch (err) {
    res.serverError(err);
  }
};

const removeMember = async (req, res) => {
  try {
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
    result.contributors.members.splice(result.contributors.members.indexOf(user), 1);

    await Project.updateOne({ id: project }).set(result);

    unassign(req, res);

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


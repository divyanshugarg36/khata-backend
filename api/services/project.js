const { sendBadRequest, verifyToken } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');
const { create: createAssignment, view: viewAssignment } = require('./assignment');

const { ACCESS_FORBIDDEN, DATA_MISSING, NOT_FOUND } = ERROR_TYPES;

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

    const data = {
      user: verified.user.id,
      project,
    };
    viewAssignment(req, res, data);

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
    const assignments = await Assignment.find({ user });
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

module.exports = {
  create,
  view,
  update,
  remove,
  fetchAll,
};


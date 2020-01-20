const { sendBadRequest, verifyToken } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');
const { create: createAssignment } = require('./assignment');

const { ACCESS_FORBIDDEN, DATA_MISSING, NOT_FOUND } = ERROR_TYPES;

const create = async (req, res) => {
  try {
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { body: data } = req;
    if(!data.name) {
      return res.sendBadRequest(res, DATA_MISSING);
    }

    data.admin = verified.user.id;
    const project = await Project.create(data).fetch();
    res.send({
      success: true,
      project
    });

    req.body = {
      user: data.admin,
      project: project.id,
    };
    createAssignment(req, res, true);

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

    res.send({
      success: true,
      project
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

    const user = req.body.user && verified.user.id;
    const projects = [];
    const assignments = await Assignment.find({ user });
    for(let assignment of assignments.values()) {
      projects.push(await Project.findOne({ id: assignment.project }));
    }
    res.send({
      success: true,
      projects
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


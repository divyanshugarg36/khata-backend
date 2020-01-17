const { sendBadRequest } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACCESS_FORBIDDEN, DATA_MISSING, NOT_FOUND } = ERROR_TYPES;

module.exports = {
  create: async (req, res) => {
    try {
      const verified = verifyToken(req.headers);
      if(!verified.success) {
        return sendBadRequest(res, ACCESS_FORBIDDEN);
      }

      const { body: data } = req;
      if(!data.user || !data.project) {
        return res.sendBadRequest(res, DATA_MISSING);
      }

      const assignment = await Assignment.create(data).fetch();
      res.send({
        success: true,
        assignment
      });
    } catch (err) {
      res.serverError(err);
    }
  },

  view: async (req, res) => {
    try {
      const verified = verifyToken(req.headers);
      if(!verified.success) {
        return sendBadRequest(res, ACCESS_FORBIDDEN);
      }

      const { id } = req.body;
      if(!id) {
        return sendBadRequest(res, DATA_MISSING);
      }

      const assignment = await Assignment.findOne({ id });
      if(!assignment) {
        return sendBadRequest(res, NOT_FOUND);
      }

      res.send({
        success: true,
        assignment
      });
    } catch (err) {
      res.serverError(err);
    }
  },

  update: async (req, res) => {
    try {
      const verified = verifyToken(req.headers);
      if(!verified.success) {
        return sendBadRequest(res, ACCESS_FORBIDDEN);
      }

      const { body: data } = req;
      if(!data.id) {
        return sendBadRequest(res, DATA_MISSING);
      }

      const assignment = await Assignment.updateOne({ id: data.id }).set(data);
      if(!assignment) {
        return sendBadRequest(res, NOT_FOUND);
      }

      res.send({
        success: true,
        assignment
      });
    } catch (err) {
      res.serverError(err);
    }
  },

  delete: async (req, res) => {
    try {
      const verified = verifyToken(req.headers);
      if(!verified.success) {
        return sendBadRequest(res, ACCESS_FORBIDDEN);
      }

      const { id } = req.body;
      if(!id) {
        return sendBadRequest(res, DATA_MISSING);
      }

      const assignment = await Assignment.destroy({ id }).fetch();
      if(!assignment) {
        return sendBadRequest(res, NOT_FOUND);
      }

      res.send({
        success: true,
        assignment
      });
    } catch (err) {
      res.serverError(err);
    }
  }
};


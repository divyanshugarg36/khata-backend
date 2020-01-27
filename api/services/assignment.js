const { sendBadRequest, verifyToken } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACTION_FAILED, ACCESS_FORBIDDEN, DATA_MISSING, NOT_FOUND } = ERROR_TYPES;

// To create a new assignment (Project -> User [or] User -> Project)
const create = async (req, res, isVerified = false, project = null) => {
  try {
    // Skip if token is already verified
    if(!isVerified) {
      const verified = verifyToken(req.headers);
      if(!verified || !verified.success) {
        return sendBadRequest(res, ACCESS_FORBIDDEN);
      }
    }

    // To check if required data is provided
    const { body: data } = req;
    if(!data.user || !data.project) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Creates the assignment
    const assignment = await Assignment.create(data).fetch();
    if(project) {
      assignment.project = project;
    }
    res.send({
      success: true,
      assignment
    });
  } catch (err) {
    res.serverError(err);
  }
};

// To view the details of an assignment
const view = async (req, res, projectData = null) => {
  try {
    // Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    let assignment;
    const { user, project } = projectData;

    // To find the assignment from user and project ID, otherwise from assignment ID
    if(projectData) {
      assignment = await Assignment.findOne({ user, project: project.id });
    } else {
      const { id } = req.body;
      if(!id) {
        return sendBadRequest(res, DATA_MISSING);
      }
      assignment = await Assignment.findOne({ id });
    }

    if(!assignment) {
      return sendBadRequest(res, NOT_FOUND);
    }
    // Add project details in assignment for sending response to client
    assignment.project = project;
    res.send({
      success: true,
      assignment
    });
  } catch (err) {
    res.serverError(err);
  }
};

// To update the information in assignment
const update = async (req, res) => {
  try {
    // Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { body: data } = req;
    if(!data.id) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Updates the information
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
};

// Removes the assignment from database
const remove = async (req, res) => {
  try {
    // Verify the token to authenticate the user
    const verified = verifyToken(req.headers);
    if(!verified || !verified.success) {
      return sendBadRequest(res, ACCESS_FORBIDDEN);
    }

    const { id } = req.body;
    if(!id) {
      return sendBadRequest(res, DATA_MISSING);
    }

    // Deletes the assignment
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
};

// To make the assignment unactive
const unassign = async (req, res) => {
  try {
    const { user, project } = req.body;

    // Finds the assignment
    const assignment = await Assignment.findOne({ user, project, active: true });
    assignment.active = false;
    
    // Updates the assignment
    const result = await Assignment.updateOne({ user, project, active: true }).set(assignment);
    if(!result) { 
      return sendBadRequest(res, ACTION_FAILED);
    }
  } catch (err) {
    res.serverError(err);
  }
}

module.exports = {
  create,
  view,
  update,
  remove,
  unassign,
};

const { sendBadRequest } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACTION_FAILED, DATA_MISSING } = ERROR_TYPES;

const create = async (req, res) => {
  try {
    const { invoiceNumber, project } = req.body;

    if(!invoiceNumber || !project) {
      return sendBadRequest(res, DATA_MISSING);
    }
    const { name, client, role, assignments, description } = project;
    const items = [];
    assignments.map((a) => {
      items.push({
        name: a.title,
        hours: a.hours,
        unitPrice: a.price,
        cost: a.cost,
        tasks: a.tasks,
      });
    });
    const data = {
      invoiceNumber,
      project: {
        name,
        client,
        role,
      },
      date: new Date().toDateString(),
      description,
      items,
      total: project.total
    };

    const invoice = await Invoice.create(data).fetch();
    if(!invoice) {
      return sendBadRequest(res, ACTION_FAILED);
    }
    res.send({
      success: true,
      invoice
    });
  } catch (err) {
    res.serverError(err);
  }
};

module.exports = {
  create,
};

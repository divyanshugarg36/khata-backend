const { sendBadRequest } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACTION_FAILED, DATA_MISSING, NOT_FOUND } = ERROR_TYPES;

const create = async (req, res) => {
  try {
    const { project: id, start, end } = req.body;
    const project = await Project.findOne({id});
    const users = await User.find({ role: 'member' });
    const { name, client, role, description, assignments } = project;
    const items = assignments.filter((a) => a.active).map((a) => {
      a.name = users.find((u) => u.id === a.id).name;
      return {
        name: `${a.role} (${a.name})`,
        type: a.type,
        hours: a.type === 'Hourly' ? 0 : 'NA',
        price: Number(a.price),
        cost: Number(a.price),
        tasks: []
      };
    });
    const data = {
      invoiceNumber: Math.random().toString(32).slice(2, 7).toUpperCase(),
      project: {
        name,
        client,
        role,
      },
      description,
      items,
      total: 0,
      start,
      end,
    };
    const invoice = await Invoice.create(data).fetch();
    res.send({
      success: true,
      invoice,
    });
  } catch (err) {
    res.serverError(err);
  }
};

const save = async (req, res) => {
  try {
    const { invoice } = req.body;
    if(!invoice) {
      return sendBadRequest(res, DATA_MISSING);
    }
    const { id } = invoice;
    delete invoice.id;
    const result = await Invoice.updateOne({id}).set(invoice);
    if(!result) {
      return sendBadRequest(res, ACTION_FAILED);
    }
    res.send({
      success: true,
      invoice: result,
    });
  } catch (err) {
    res.serverError(err);
  }
};

const fetchAll = async (req, res) => {
  try {
    const invoices = await Invoice.find({});
    res.send({
      success: true,
      invoices,
    });
  } catch (err) {
    res.serverError(err);
  }
};

const view = async (req, res) => {
  try {
    const { id } = req.body;
    const invoice = await Invoice.findOne({id});
    if (!invoice) {
      return sendBadRequest(res, NOT_FOUND);
    }

    res.send({
      success: true,
      invoice,
    });
  } catch (err) {
    res.serverError(err);
  }
};

module.exports = {
  create,
  save,
  fetchAll,
  view,
};

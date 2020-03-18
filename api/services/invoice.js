const { sendBadRequest } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACTION_FAILED, DATA_MISSING, NOT_FOUND } = ERROR_TYPES;

const create = async (req, res) => {
  try {
    const { project: id, start, end } = req.body;
    const { name, client, role, description, assignments, togglId } = await Project.findOne({id});
    const users = await User.find({ role: 'member' });
    const items = assignments.filter((a) => a.active).map((a) => {
      const { name, toggl: { uid } } = users.find((u) => u.id === a.id);
      a.name = `${a.role} (${name})`;
      a.uid = uid;
      a.hours = a.type === 'Hourly' ? 0 : 'NA';
      a.price = a.cost = Number(a.price);
      return a;
    });
    const invoiceNumber = Math.random().toString(32).slice(2, 7).toUpperCase();
    const project = { name, client, role, togglId };
    const data = { invoiceNumber, project, description, items, total: 0, start, end };
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

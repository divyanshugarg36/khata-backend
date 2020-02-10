const { sendBadRequest } = require('../util');
const { ERROR_TYPES } = require('../const/errorTypes');

const { ACTION_FAILED, DATA_MISSING } = ERROR_TYPES;

const create = async (req, res) => {
  try {
    const { body: data } = req;
    if(!data.invoiceNumber) {
      return sendBadRequest(res, DATA_MISSING);
    }

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

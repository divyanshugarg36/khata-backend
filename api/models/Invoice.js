module.exports = {
  attributes: {
    invoiceNumber: {
      type: 'string',
      required: true,
    },
    project: {
      type: 'json',
      columnType: 'object',
      defaultsTo: {},
    },
    start: {
      type: 'string',
      columnType: 'date',
    },
    end: {
      type: 'string',
      columnType: 'date',
    },
    description: {
      type: 'string',
    },
    items: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [],
    },
    total: {
      type: 'number',
    }
  },
};

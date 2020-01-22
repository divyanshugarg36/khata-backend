module.exports = {
  attributes: {
    user: {
      type: 'string',
      required: true
    },
    project: {
      type: 'string',
      required: true
    },
    price: {
      type: 'number'
    },
    active: {
      type: 'boolean',
      defaultsTo: true
    },
    type: {
      type: 'string'
    }
  },
};


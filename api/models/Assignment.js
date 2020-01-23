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
      type: 'string'
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


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
    startDate: {
      type: 'string',
      columnType: 'date'
    },
    endDate: {
      type: 'string',
      columnType: 'date'
    },
    price: {
      type: 'number'
    },
    active: {
      type: 'boolean'
    },
    type: {
      type: 'string'
    }
  },
};


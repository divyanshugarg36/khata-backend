module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    active: {
      type: 'boolean',
      defaultsTo: true,
    },
    admin: {
      type: 'json',
      columnType: 'object',
    },
    assignments: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [],
    },
  },
};


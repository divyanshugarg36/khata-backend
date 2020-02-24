module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    client: {
      type: 'string',
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


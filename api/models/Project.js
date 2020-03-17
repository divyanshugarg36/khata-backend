module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    client: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    active: {
      type: 'boolean',
      defaultsTo: true,
    },
    togglId: {
      type: 'string',
    },
    assignments: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [],
    },
  },
};


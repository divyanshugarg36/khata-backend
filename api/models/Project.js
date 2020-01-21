module.exports = {
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    contributors: {
      type: 'json',
      columnType: 'object',
      defaultsTo: {
        admin: '',
        members: [],
      },
    },
  },
};


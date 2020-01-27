module.exports.models = {
  migrate: 'safe',
  attributes: {
    createdAt: { type: 'number', autoCreatedAt: true, },
    updatedAt: { type: 'number', autoUpdatedAt: true, },
    id: { type: 'string', columnName: '_id', },
  },
  dataEncryptionKeys: {
    default: 'CJC9Pk+cBFjlhQ/ocUItxZ0EVFPxD7xe6aYPewjlZRY='
  },
  cascadeOnDestroy: true
};

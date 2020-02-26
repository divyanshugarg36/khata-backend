module.exports.routes = {
  // Authorization
  'POST /login': 'AuthController.login',
  'POST /verifypassword': 'AuthController.verifyPassword',

  // User
  'POST /user/add': 'UserController.addMember',
  'POST /register': 'UserController.register',
  'POST /user/fetch': 'UserController.fetch',
  'POST /user/all': 'UserController.fetchAll',
  'PUT /user/update': 'UserController.update',

  // Project
  'POST /project/add': 'ProjectController.create',
  'POST /project/view': 'ProjectController.view',
  'PUT /project/update': 'ProjectController.update',
  'POST /project/remove': 'ProjectController.remove',
  'POST /project/all': 'ProjectController.fetchAll',
  'POST /project/member/add': 'ProjectController.addMember',
  'POST /project/member/remove': 'ProjectController.removeMember',

  // Invoice
  'POST /invoice/create': 'InvoiceController.create',
};

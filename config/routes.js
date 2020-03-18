module.exports.routes = {
  // Authorization
  'POST /login': 'AuthController.login',
  'POST /verifypassword': 'AuthController.verifyPassword',

  // User
  'POST /user/add': 'UserController.createMember',
  'POST /register': 'UserController.register',
  'POST /user/fetch': 'UserController.fetchUser',
  'POST /user/all': 'UserController.fetchAll',
  'PUT /user/update': 'UserController.updateProfile',
  'POST /user/update/password': 'UserController.updatePassword',
  'POST /user/remove': 'UserController.removeMember',

  // Project
  'POST /project/add': 'ProjectController.createProject',
  'POST /project/view': 'ProjectController.viewProject',
  'PUT /project/update': 'ProjectController.updateProject',
  'POST /project/remove': 'ProjectController.removeProject',
  'POST /project/all': 'ProjectController.fetchAll',
  'POST /project/member/add': 'ProjectController.addMember',
  'POST /project/member/remove': 'ProjectController.removeMember',

  // Invoice
  'POST /invoice/create': 'InvoiceController.create',
  'POST /invoice/save': 'InvoiceController.save',
  'POST /invoice/all': 'InvoiceController.fetchAll',
  'POST /invoice/view': 'InvoiceController.view',

  // History
  'POST /history/get': 'HistoryController.getHistory',
};

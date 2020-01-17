module.exports.routes = {
  // Authorization
  'POST /login': 'AuthController.login',
  'POST /verifypassword': 'AuthController.verifyPassword',

  // User
  'POST /register': 'UserController.register',
  'GET /user/fetch': 'UserController.fetch',
  'GET /user/all': 'UserController.fetchAll',
  'PUT /user/update': 'UserController.update',
};

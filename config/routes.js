module.exports.routes = {
  // Authorization
  'POST /login': 'AuthController.login',
  'POST /verifytoken': 'AuthController.verifyToken',

  // User
  'POST /register': 'UserController.register',
  'GET /user/fetch': 'UserController.fetch',
  'GET /user/all': 'UserController.fetchAll'
};

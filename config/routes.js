module.exports.routes = {
  // Authorization
  'POST /login': 'AuthController.login',

  // User
  'POST /register': 'UserController.register',
  'GET /user/fetch': 'UserController.fetch',
  'GET /user/all': 'UserController.fetchAll'
};

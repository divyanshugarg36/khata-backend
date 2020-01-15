module.exports.routes = {
  'POST /login': 'AuthController.login',
  'POST /register': 'UserController.register',
  'GET /user/fetch': 'UserController.fetch',
};

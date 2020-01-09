module.exports.routes = {
  '/': { view: 'pages/homepage' },
  '/logout': 'AuthController.logout',
  'GET /login': { view: 'login' },
  'GET /register': { view: 'register' },
  'POST /login': 'AuthController.login',
  'POST /register': 'UserController.register',
};

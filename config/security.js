module.exports.security = {
  cors: {
    allRoutes: true,
    allowOrigins: '*',
    allowRequestMethods: 'GET, POST, PUT, DELETE, OPTIONS, HEAD',
    allowRequestHeaders: 'content-type, Authorization'
  }
};

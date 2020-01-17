module.exports = (headers) => {
  try {
    if(headers.common && headers.common.Authorization) {
      const token = req.headers.common.Authorization;
      jwt.verify(token, sails.config.secret, (err) => {
        if(err) {
          return {
            success: !error,
          };
        }
      });
    } else {
      return {
        success: false,
      };
    }
  } catch (err) {
    res.serverError(err);
  }
};

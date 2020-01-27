module.exports = {
  mongoURL:'mongodb+srv://superuser:superpass@khata-p3bjd.mongodb.net/khata?authSource=admin',
  sockets: {
    onlyAllowOrigins: ['http://localhost:3000','https://khata-ryaz.herokuapp.com']
  },
  session:{
    cookie:{
      secure:true
    }
  },
  http:{
    trustProxy:true
  },
  expiresIn:60 * 60 * 24 * 7,
};

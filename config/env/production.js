module.exports = {
  mongoURL:'mongodb://superuser:superpass@khata-p3bjd.mongodb.net/khata',
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

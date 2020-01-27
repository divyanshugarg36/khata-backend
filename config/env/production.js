module.exports = {
  mongoURL:'mongodb://superuser:superpass@khata-shard-00-00-p3bjd.mongodb.net:27017,khata-shard-00-01-p3bjd.mongodb.net:27017,khata-shard-00-02-p3bjd.mongodb.net:27017/test?ssl=true&replicaSet=khata-shard-0&authSource=admin&retryWrites=true&w=majority',
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

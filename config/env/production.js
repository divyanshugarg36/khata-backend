module.exports = {
  'mongo':{
    host: 'khata-p3bjd.mongodb.net',
    port: 27017,
    user: 'superuser',
    password: 'superpass',
    database: 'khata'
  },
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

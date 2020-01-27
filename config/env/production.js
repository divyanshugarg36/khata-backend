module.exports = {
  'mongo':{
    host: 'khata-p3bjd.mongodb.net',
    port: '',
    user: 'superuser',
    password: 'superpass',
    database: 'khata'
  },
  sockets: {
    onlyAllowOrigins: ['https://skillshape.netlify.com', 'http://localhost:8000','https://app-skillshape.herokuapp.com','https://app.skillshape.com']
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

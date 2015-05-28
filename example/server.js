var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({port : process.env.PORT || 3000});

server.register({
  register: require('../')
}, function(err){
});

server.start(function(){
  console.log(server.info.uri);
});


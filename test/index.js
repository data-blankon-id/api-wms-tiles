var Code = require('code');
var Hapi = require('hapi');
var Lab = require('lab');

var lab = exports.lab = Lab.script();
var it = lab.it;
var expect = Code.expect;
var describe = lab.describe;

var config = require('./config');

describe('WMS Tiles Server API', function(){
  it ('should not call the current weather data', function(done){
    var server = new Hapi.Server();
    server.connection();
    server.register(require('../'), function(err) {
      var options = {
        method: 'GET',
        url: '/wms?' + config.urls[0]
      };
      server.inject(options, function(res){
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
});

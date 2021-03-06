var request = require('hyperquest');
var config = require('../config');
var qs = require('querystring');
var crypto = require('crypto');
var boom = require('boom');
var fs = require('fs');

var Plugin = function(server, options, next) {
  if (!(this instanceof Plugin)) {
    return new Plugin(server, options, next);
  }
  this.server = server;
  this.options = options || {};
  this.register();
  try {
    fs.mkdirSync(config.dir);
  }
  catch(ex) {}
  function write(file, prefix, query, next) {
    var writeStream = fs.createWriteStream(file);
    var url = config.rootUrl + (prefix ? prefix : '');
    var r = request(url + '?' + query);
    r.pipe(writeStream);
    r.on('error', function(err){
      console.log(err);
    });
    writeStream.on('finish', function() {
      next(null, file);
    }); 
  }
  function wms(prefix, query, next) {
    var shasum = crypto.createHash('sha1');
    var file = shasum.update(query).digest('hex');
    file = config.dir + '/' + file;
    fs.exists(file, function(exists){
      //if (!exists)
      return write(file, prefix, query, next);
      //next(null, file);
    });
  }
  server.method('wms', wms, {
    cache: {
      expiresIn: config.cacheExpiresIn
    }
  });
}

Plugin.prototype.register = function() {
  var self = this;
  var routes = config.routes;
  var wms = config.routes['wms'];
  self.server.route({
    method: 'GET',
    path: '/wms',
    config: {
      handler: function(req, reply) {
        self.server.methods.wms('', qs.stringify(req.query), function(err, path) {
          if (err)
            return reply(boom.wrap(err));
          reply.file(path).type('Content-Type', 'image/png');
        });
      },
      description: wms.description || 'No description yet.',
      notes: wms.notes || 'No implementation notes yet.',
      validate: wms.validate || {},
      tags: wms.tags || ['api']
    }
  });
  
  self.server.route({
    method: 'GET',
    path: '/wms/tile/{a}/{b}/{c}',
    config: {
      handler: function(req, reply) {
        var arr = req.path.split('/');
        arr.splice(1,2);
        var prefix = arr.join('/');
        self.server.methods.wms(prefix, qs.stringify(req.query) || req.path, function(err, path) {
          if (err)
            return reply(boom.wrap(err));
          reply.file(path).type('Content-Type', 'image/png');
        });
      },
      description: wms.description || 'No description yet.',
      notes: wms.notes || 'No implementation notes yet.',
      validate: wms.validate || {},
      tags: wms.tags || ['api']
    }
  });
}

exports.register = function(server, options, next) {
  Plugin(server, options, next);
  next();
}

exports.register.attributes = {
  pkg: require(__dirname + '/../package.json')
};

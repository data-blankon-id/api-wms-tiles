var SECOND = 1000;
module.exports = {
  rootUrl: 'http://portal.ina-sdi.or.id/arcgis/rest/services/IGD/BatasWilayah_NKRI/MapServer',
  cacheExpiresIn: 30 * 24 * 60 * 60 * SECOND,
  dir: __dirname + '/wms-tiles'
};

// exported routes from rootUrl API
module.exports.routes = {
  wms : {
    path: '/'
  }
}

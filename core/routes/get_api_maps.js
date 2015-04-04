/**
 * Serves proxies /_api reqs to couchdb
 */
var Nano = require('nano');
var stream = require('stream');

module.exports = function (env_config) {
  var nano = Nano( { url: env_config.couch.url } );
  return {
    method: 'GET',
    path: '/api/maps',
    handler: function handler(request, reply) {
      var routedb = nano.use('routes');

      var objectifier = new stream.PassThrough()
        .wrap(routedb.view('maps', 'by_origin', { group: true }));

      reply(objectifier)
        .type('application/json');
    }
  };

}

/**
 * Serves proxies /_api reqs to couchdb
 */
var Nano = require('nano');
var stream = require('stream');

module.exports = function (env_config) {
  var nano = Nano( { url: env_config.couch.url } );
  return {
    method: 'GET',
    path: '/api/from{q?}',
    handler: function handler(request, reply) {
      var routedb = nano.use('routes');
      var objectifier = new stream.PassThrough()
        .wrap(routedb.view('maps', 'autocomplete_from',{
            startkey: request.query.q,
            endkey: request.query.q+"\ufff0",
            inclusive_end: false,
            group: true
          }
        ));

      reply(objectifier)
        .type('application/json');
    }
  };

}

/**
 * Serves proxies /_api reqs to couchdb
 */
var Nano = require('nano');
var stream = require('stream');
var dijkstras = require('./_lib/dijkstras');
var JSONStream = require('JSONStream');

module.exports = function (env_config) {
  var nano = Nano( { url: env_config.couch.url } );
  return {
    method: 'POST',
    path: '/api/dijkstras',
    config: {
      payload:{
        parse: true
      },
    },
    handler: function handler(request, reply) {
      var payload = request.payload;
      var routedb = nano.use('routes');

      var outgoingWrap = new stream.PassThrough().wrap(routedb.view('maps', 'outgoing', { group: true }));


      var objectifier = new stream.PassThrough()
        .pipe(outgoingWrap)
        .pipe(JSONStream.parse(['rows', true]))
        .pipe(dijkstras(payload.from, payload.to))
        .pipe(JSONStream.stringify());

      objectifier.on('end', function() {
        console.log(arguments)
        reply(arguments);
      })
    }
  };

}

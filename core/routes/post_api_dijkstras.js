/**
 * Serves proxies /_api reqs to couchdb
 */
var Nano = require('nano');
var stream = require('stream');
var dijkstras = require('./_lib/dijkstras');
var JSONStream = require('JSONStream');

module.exports = function (env_config) {
  var nano = Nano( { url: env_config.couch.url } );
  var routedb = nano.use('routes');

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

      var outgoingWrap = new stream.Readable( { objectMode: true } )
        .wrap(routedb.view('maps', 'outgoing', { group: true }));
      var dijkstrasifier =  dijkstras(payload.from, payload.to);
      var jSONStreamParser = JSONStream.parse(['rows', true]);


      outgoingWrap
        .pipe(jSONStreamParser)
        .pipe(dijkstrasifier);

      dijkstrasifier.on('end', function(path) {

        var keys = [];
        path.reduce(function (a, c) {
          keys.push([a, c]);
          return c;
        });
        routedb.view('maps', 'kms', { keys: keys }, function (err, data) {
          if (err) return reply('Error');
          reply(data.rows || []);
        });
      });
    }
  };

}

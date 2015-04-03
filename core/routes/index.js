/**
 * Serves proxies /_api reqs to couchdb
 */
var Model = require('../models');
var Stream = require('../stream');
var stream = require('stream');

module.exports = function (env_config) {

  return [
    {
      method: 'GET',
      path: '/api/maps',
      handler: function (request, reply) {
        return reply('ok');
      }
    },
    {
      method: 'POST',
      path: '/api/maps',
      config: {
        payload:{
          maxBytes: 209715200,
          output:'stream',
          allow: 'multipart/form-data',
          parse: true
        },
      },
      handler: function (request, reply) {
        debugger;
        var payload = request.payload;
        var parameter = JSON.parse(payload.parameter);
        file = payload[parameter.file];

        if (file) {


          console.log(file)

          var base = {
            type: 'route',
            origin: parameter.name
          }
          var attrs = ['from', 'to', 'km'];

          var PassThrough = new stream.PassThrough( { objectMode: true } );
          PassThrough
            .wrap(file)
            .pipe(Stream.liner('\n'))
            .pipe(Stream.objectifier(' '))
            .pipe(Stream.transform_2(Model.Models.Route, attrs, base))
            .pipe(Stream.validate_2(Model.Models.Route))
            .pipe(Stream.writer_2(env_config));

          PassThrough.on('end', function(){
            reply({"Status":"Done"});
          }).on('error', function(){
            reply('Error in uploading');
          });
        }

      }
    }

  ];

}

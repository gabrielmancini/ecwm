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
      handler: function handler(request, reply) {
        debugger;
        var payload = request.payload;
        var parameter = JSON.parse(payload.parameter);
        file = payload[parameter.file];

        var base = {
          type: 'route',
          origin: parameter.name
        }
        var attrs = ['from', 'to', 'km'];

        if (file) {
          file
//            .pipe(Stream.liner('\n'))
//            .pipe(Stream.objectifier(' '))
            .pipe(Stream.parser())
            .pipe(Stream.transform(Model.Models.Route, attrs, base))
            .pipe(Stream.validate(Model.Models.Route))
            .pipe(Stream.writer(env_config));
          file
            .on('end', function (){
              reply({"Status":"Done"});
            })
            .on('error', function (){
              reply('Error in uploading');
            });
        } else {
          reply('file not found: ' + parameter.file );
        }

      }
    }

  ];

}

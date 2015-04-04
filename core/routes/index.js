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
      path: '/{param*}',
      handler: {
          directory: {
              path: env_config.maps.www_path
          }
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
        var payload = request.payload;
        var parameter = JSON.parse(payload.parameter);
        if (!(parameter && parameter.file)) {
          return reply('parameter json not found: parameter={"file": "fileInput"} where fileInput is as input multipart/form-data' );
        }
        file = payload[parameter.file];

        var base = {
          type: 'route',
          origin: parameter.file
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
              return reply({"Status":"Done"});
            })
            .on('error', function (){
              return reply('Error in uploading');
            });
        } else {
          return reply('file not found: ' + parameter.file );
        }

      }
    }

  ];

}

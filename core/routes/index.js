/**
 * Serves proxies /_api reqs to couchdb
 */
var Model = require('../models');
var Stream = require('../stream');
var moment = require('moment');
var Cloudant = require('../cloudant');

module.exports = function (env_config) {

  var db = 'routes';

  var cloudant = Cloudant(env_config);
  cloudant.db_create(db, function () { console.log(arguments) });

  return [
    {
      method: 'GET',
      path: '/api/maps',
      handler: function (req, reply) {
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
              parse: true
        },
        handler: function (req, reply) {
          var payload = req.payload;
          var parameter = JSON.parse(payload.parameter);
          var file = payload[parameter.file];

          var base = {
            type: 'route',
            origin: parameter.name
          }

          file
            .pipe(Stream.parser)
            .pipe(Stream.transform(Model.Models.Route, ['from', 'to', 'km'], base))
            .pipe(Stream.validate(Model.Models.Route))
            .pipe(Stream.writer(env_config, db));

          //payload.createAt = moment.utc();
          //payload.updateAt = moment.utc();
          //var schema = Model.get('map');
          //if (Model.validate(req.payload, schema)) {
          //  return reply({ status: 'ok' });
          //} else {
          //  console.log(Model.error)
          //  return reply(schema.error).code(500);
          //}
        }
      }
    }

  ];

}

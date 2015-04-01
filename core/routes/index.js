/**
 * Serves proxies /_api reqs to couchdb
 */
var Model = require('../models');
var Stream = require('../stream');
var moment = require('moment');


module.exports = [

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
        var parameter = JSON.parse(payload.json).parameter;
        var file = payload[parameter.file];

        file
          .pipe(Stream.parser)
          .pipe(Stream.transform(['from', 'to', 'km']))
          .pipe(Stream.validate(Model.route))
          .pipe(Stream.writer);

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


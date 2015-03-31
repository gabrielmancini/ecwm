/**
 * Serves proxies /_api reqs to couchdb
 */
var Model = require('../models');
var moment = require('moment');


module.exports = [

  {
    method: 'GET',
    path: '/api/maps',
    handler: function (req, reply) {
      return reply('ok');
    }
  }

];


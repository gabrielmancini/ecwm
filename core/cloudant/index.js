var Nano = require('nano');

module.exports = function (env_config) {

  var nano = Nano( { url: env_config.couch.url } );

  var cloundant = {};


  cloundant.db_create = function(db, callback) {

    nano.db.create(db, function(err, body) {
      callback(err, body);
    });

  }

  cloundant.bulk_write = function(docs, db, callback) {

    var db = nano.use(db);
    db.bulk({docs: docs}, function(err, data) {
      callback(err, data);
    })
  }

  return cloundant;
}

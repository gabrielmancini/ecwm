var Nano = require('nano');
exports.start = function (env_config, cb) {

  var nano = Nano( { url: env_config.couch.url } );

  var cloundant = {};

  cloundant.bulk_write = function(docs, db, callback) {
    var db = nano.use(db);
    db.bulk({docs: docs}, function(err, data) {
      callback(err, data);
    })
  }


  cb(null, cloundant);

}

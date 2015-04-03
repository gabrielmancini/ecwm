var Nano = require('nano');

exports.start = function (env_config, callback) {

  var nano = Nano( { url: env_config.couch.url } );

  var cloundant = {};

  nano.db.create(env_config.db, function(err, body) {

    console.log('Creating db: ' + env_config.db);
    if (err && err.statusCode !== 412) { // erro caso nao exista
      callback(err, cloundant);
    } else {
      callback(null, cloundant);
    }
  });

}

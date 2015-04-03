var stream = require('stream');
var writer = new stream.PassThrough( { objectMode: true }  );
var Nano = require('nano');

module.exports = function (env_config) {

  var nano = Nano( { url: env_config.couch.url } );

  // take an object
  var i = 0;
  writer._transform = function (obj, encoding, done) {

    console.log('W',i++);
    var db = nano.use(env_config.db);
    db.insert(obj.data , function(err, data) {
      //console.log("Written", " (",obj,")");
      done();
    });

  };

  return writer;
}

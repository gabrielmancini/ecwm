var stream = require('stream'),
  Nano = require('nano'),
  BUFFER_MAX_SIZE = 500;

module.exports = function (env_config) {
  var buffer = [ ],
  written = 0;
  var writer = new stream.Transform( { objectMode: true } );
  var nano = Nano( { url: env_config.couch.url } );
  var db = nano.use(env_config.db);

  // write the contents of the buffer to CouchDB in blocks of 500
  var processBuffer = function(flush, callback) {

    if(flush || buffer.length>= BUFFER_MAX_SIZE) {
      var toSend = buffer.splice(0, buffer.length);
      buffer = [];
      db.bulk({docs: toSend} , function(err, data) {
        written += toSend.length;
        console.log("Written", toSend.length, " (",written,")");
        callback();
      });
    } else {
      callback();
    }
  }


  // take an object
  writer._transform = function (obj, encoding, done) {

    // add to the buffer
    buffer.push(obj);

    // optionally write to the buffer
    processBuffer(false,  function() {
      done();
    });

  };

  // called when we need to flush everything
  writer._flush = function(done) {
    processBuffer(true, function() {
      nano.db.compact(env_config.db, function() {
        done()
      });
    })
  }

  return writer;
}

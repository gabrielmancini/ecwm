var stream = require('stream');
var headings = null;

module.exports = function (delimiter) {
  // take a line of text
  var objectifier = new stream.PassThrough( { objectMode: true } );
  objectifier._transform = function (line, encoding, done) {

    // remove /r character
    line = line.replace(/\r$/,"");

    // make an object with key value pairs using the headings as the key
    var bits = line.split(delimiter);

    // pass the object to the next thing in the stream
    this.push(bits);
    done();


  };

  return objectifier;
}

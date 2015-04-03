// stolen from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
var stream = require('stream');

module.exports = function (newLine) {

  var liner = new stream.PassThrough( { objectMode: true } );
  liner._transform = function (chunk, encoding, done) {
     var data = chunk.toString();
     if (this._lastLineData) {
       data = this._lastLineData + data;
     }

     var lines = data.split(newLine);
     this._lastLineData = lines.splice(lines.length-1,1)[0];

     for(var i in lines) {
       this.push(lines[i]);
     }
     done();
  }

  liner._flush = function (done) {
     if (this._lastLineData) {
       this.push(this._lastLineData);
     }
     this._lastLineData = null;
     done();
  }

  liner
    .on('end', function () {
      console.log('liner end:', arguments);
    })
    .on('error', function (err){
      console.log('liner err: ',err);
    });

  return liner;
}

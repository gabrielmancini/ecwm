// stolen from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
var stream = require('stream');
var transform = new stream.Transform( { objectMode: true } );

module.exports = function (attrs) {
  transform._transform = function (line, encoding, done) {

    var obj = line.reduce(function (a, c, i) {
      a[attrs[i] || c] = c;
      return a;
    }, {});

   this.push(obj);

   done();
  }

  transform._flush = function (done) {
    if (this._lastLineData) {
      var obj = this._lastLineData.reduce(function (a, c, i) {
        a[attrs[i] || c] = c;
        return a;
      }, {});
      this.push(obj);
    }

   this._lastLineData = null;
   done();
  }

  return transform;

}

// stolen from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
var stream = require('stream');
var transform = new stream.Transform( { objectMode: true } );

module.exports = function (attrs) {


  function _transform(self, line) {
    var obj = line.reduce(function (a, c, i) {
      a[attrs[i] || c] = c;
      return a;
    }, {});

   self.push(obj);
  };

  transform._transform = function (line, encoding, done) {

    _transform(this, line);

    done();
  };

  transform._flush = function (done) {
    if (this._lastLineData) {
       _transform(this, this._lastLineData);
    }

   this._lastLineData = null;
   done();
  };

  return transform;

}

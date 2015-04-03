// stolen from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
var stream = require('stream');
var transform = new stream.Transform( { objectMode: true } );

module.exports = function (model, attrs, base) {

  function _transform(self, array) {
    var obj = array.reduce(function (a, c, i) {
      a[attrs[i] || c] = (isNaN(c)) ? c : Number(c);
      return a;
    }, base);

    self.push(new model(obj));
  };

  transform._transform = function (array, encoding, done) {
    console.log(array)
    _transform(this, array);

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

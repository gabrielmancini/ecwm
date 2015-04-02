// stolen from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
var stream = require('stream');
var transform = new stream.Transform( { objectMode: true } );

module.exports = function (model, attrs) {
  transform._transform = function (obj, encoding, done) {

debugger;
    obj.validate();

    this.push(obj.data);

    done();
  }

  transform._flush = function (done) {

    if (this._lastLineData) {
      obj.validate();

      this.push(obj.data);
    }

    this._lastLineData = null;
    done();
  }

  return transform;

}

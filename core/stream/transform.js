
// stolen from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
var stream = require('stream');
var transform = new stream.PassThrough( { objectMode: true } );

module.exports = function (model, attrs, base) {
var i = 0;
  transform._transform = function (array, encoding, done) {

    console.log('T',array);

    var obj = array.reduce(function (a, c, i) {
      a[attrs[i] || c] = (isNaN(c)) ? c : Number(c);
      return a;
    }, base);

    this.push(new model(obj));

    done();
  };

  return transform;

}

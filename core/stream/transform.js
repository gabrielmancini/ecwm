// stolen from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
var stream = require('stream');

module.exports = function (model, attrs, base) {

  var transform = new stream.Transform( { objectMode: true } );

  transform._transform = function (array, encoding, done) {

    var obj = array.reduce(function (a, c, i) {
      a[attrs[i] || c] = (isNaN(c)) ? c : Number(c);
      return a;
    }, base);

    this.push(new model(obj));

    done();
  };


  transform
    .on('end', function () {
      console.log('transform end:', arguments);
    })
    .on('error', function (err){
      console.log('transform err: ',err);
    });

  return transform;

}

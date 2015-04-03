// stolen from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
var stream = require('stream');
var transform = new stream.PassThrough( { objectMode: true } );

module.exports = function (model, attrs) {
  var i = 0;
  transform._transform = function (obj, encoding, done) {
    console.log('V',i++);
    obj.validate();

    this.push(obj.data);

    done();
  }


  return transform;

}

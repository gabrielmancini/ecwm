// stolen from http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
var stream = require('stream');

module.exports = function (model, attrs) {
  var validate = new stream.Transform( { objectMode: true } );

  validate._transform = function (obj, encoding, done) {

    obj.validate();

    this.push(obj.data);

    done();
  }

  validate
    .on('end', function () {
      console.log('validate end:', arguments);
    })
    .on('error', function (err){
      console.log('validate err: ',err);
    });

  return validate;

}

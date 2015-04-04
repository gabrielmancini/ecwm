/*
stolen from
https://github.com/mburst/dijkstras-algorithm/blob/master/dijkstras.js
*/

var stream = require('stream');
var graph = require('./graph');
module.exports = function (start, finish) {

  var passThrough = new stream.PassThrough( { objectMode: true } );

  var distances = {},
      previous = {},
      path = [],
      smallest, vertex, neighbor, alt
      path.push(start);

  passThrough._transform = function (obj, encoding, done) {
    graph.addVertex(obj.key, obj.value);
    //this.push(null);
    done();
  };

  passThrough._flush = function(done) {
    var path = graph.shortestPath(start, finish).concat([start]).reverse()
    this.push(path);
    this.emit('end', path);
    done();
  }

  return passThrough;

}

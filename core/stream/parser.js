var csv = require("fast-csv");

var opt = {
  delimiter: ' ', // comma, semicolon, whatever
  newline: '\n', // newline character (use \r\n for CRLF files)
  quote: '"', // what's considered a quote
  empty: '', // empty fields are replaced by this,

  // specify the encoding of the source if it's something other than utf8
  inputEncoding: '',

  // if true, emit arrays instead of stringified arrays or buffers
  objectMode: true,

  // if set to true, uses first row as keys -> [ { column1: value1, column2: value2 }, ...]
  columns: false
}


module.exports = function () {
  var parse = new csv.parse(opt);
//  parse
//    .on("data", function(data) {
//      console.log(data);
//      console.log('-----------')
//    });
//    .on("end", function() {
//      console.log('end', arguments);
//      return parse.end();
//    });

  return parse;
}

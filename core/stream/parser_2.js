var csv = require('csv-streamify');

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

// AND/OR
module.exports = function () {
  function callback(err, doc) {
    if (err) return console.log('error on csv-streamify: ',err, doc);
    return doc;
  }
  return csv(opt, callback);
};

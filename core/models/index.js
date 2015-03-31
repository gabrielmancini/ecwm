var tv4 = require('tv4');

var Schemas = require('./schemas');

tv4.addFormat({
  'date-time': function (data) {
    return isValidDate(data);
  }
});

Object.keys(Schemas)
  .map(function (key) {
    tv4.addSchema(key, Schemas[key]);
    console.log('Load Schema: ' + key)
  })

var Models = {
  get: tv4.getSchema,
  validate: tv4.validate,
  map: tv4.getSchemaMap,
  error: tv4.error
}

module.exports = Models;

var inherits = require('util').inherits;
var tv4 = require('tv4');
var S = require('string');
var moment = require('moment');
var Base = require ('./base');
var schemas = require('./schemas');

tv4.addFormat({
  'date-time': function (data) {
    return moment.isDate(new Date(data));
  }
});

module.exports.Models = {}

// load Schemas
Object.keys(schemas)
  .map(function (key) {
    var capitalized = S(key).capitalize().s;
    var capitalizedSchema = capitalized + 'Schema'
    //Add Schema
    tv4.addSchema(capitalizedSchema, schemas[key]);

    function Model (doc) {
      Base.call(this, doc);
      this.me = capitalized;
      this.schema = tv4.getSchema(capitalizedSchema);
    };
    Model.prototype.__proto__ = Base.prototype;
    //inherits(Model, Base);

    module.exports.Models[capitalized] = Model;
    console.log('Load Schema: ' + capitalized);
  })


module.exports.Schemas = {
  get: tv4.getSchema,
  map: tv4.getSchemaMap,
  error: tv4.error
};

var tv4 = require('tv4');
var S = require('string');
var moment = require('moment');

var schemas = require('./schemas');

tv4.addFormat({
  'date-time': function (data) {
    return isValidDate(data);
  }
});

module.exports.Models = {}

// create Modules

var Base = function Base() {
  this.createAt = moment.utc();
  this.updateAt = moment.utc();
}
Base.prototype.validate = function (data) {
  return tv4.validate(this, this.schema, validationFailure)

}

Base.prototype.validationFailure = function (isValid, validationError) {
  if (!isValid) {
    this.validationError = validationError;
  }
}


// load Schemas
Object.keys(schemas)
  .map(function (key) {
    var capitalized = S(key).capitalize().s;
    var capitalizedSchema = capitalized + 'Schema'
    //Add Schema
    tv4.addSchema(capitalizedSchema, schemas[key]);
    var object = {};
    object = Object.create(Base.prototype)
    object.me = capitalized;
    object.schema = tv4.getSchema(capitalizedSchema);
    module.exports.Models[capitalized] = object;
    console.log('Load Schema: ' + capitalized);
  })


module.exports.Schemas = {
  get: tv4.getSchema,
  map: tv4.getSchemaMap,
  error: tv4.error
};

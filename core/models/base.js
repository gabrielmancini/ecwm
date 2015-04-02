var tv4 = require('tv4');
var _ = require('lodash');
var moment = require('moment');

function Base(json) {

  this.data = {
    createAt: moment().toJSON(),
    updateAt: moment().toJSON(),
    validationError: null
  };
  this.validationError = null;

  _.extend(this.data, json || {});

};

Base.prototype.validate = function () {
  this.data.validationError = tv4.validateMultiple(this.data, this.schema);
  return this.data.validationError.valid;
};

module.exports = exports = Base;

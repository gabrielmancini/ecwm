var async = require('async');
var domain = require('domain');
var _ = require('lodash');


var couch = require('./couchdb');
var server = require('./server');
var environment = require('./environment');


exports.init = function (env_config, callback) {
  var app_domain = domain.create();

  // make sure we print a stack trace in node 0.10.x
  app_domain.on('error', function (err) {
    console.error(err.stack || err.toString());
    process.exit(1);
  });

  app_domain.run(function (err) {


    if (err) {
      return callback(err);
    }

    // start the app
    console.log('Initializing...');

    async.series({
      couch: async.apply(couch.start, env_config),
      server: async.apply(server.start, env_config),
    }, callback);

  });

};

exports.start = function (config, callback) {

  var env_config = environment.getConfig(
    process.platform,   // platform
    process.env,        // environment vars
    process.cwd(),      // project directory
    config              // command-line arguments
  );

  exports.init(env_config, callback);

};


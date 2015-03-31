/**
 * Starts a local CouchDB instance using the Hoodie app's data
 * directory for storage.
 */

var MultiCouch = require('multicouch');
var async = require('async');
var path = require('path');


/**
 * Starts the CouchDB server using multicouch
 */

exports.start = function (env_config, callback) {

  // skip local couch server on some platforms (eg, nodejitsu)
  if (!env_config.couch.run) {
    console.log('Using remote CouchDB: ' + env_config.couch.url);
    return process.nextTick(callback);
  }

  // MultiCouch env_config object
  var couch_cfg = {
    port: env_config.couch.port,
    prefix: env_config.maps.data_path,
    couchdb_path: env_config.couch.bin,
    default_sys_ini: env_config.couch.default_ini,
    respawn: false, // otherwise causes problems shutting down on ctrl-c
    session_timeout: (60 * 60 * 24 * 2).toString() // 2 days
  };

  // starts a local couchdb server using the Hoodie app's data dir
  var couchdb = new MultiCouch(couch_cfg);

  // used to pass startup errors to callback
  var started = false;

  // local couchdb has started
  couchdb.on('start', function () {

    console.log(
      'CouchDB started: ' +
      'http://' + env_config.host + ':' + env_config.couch.port
    );

    started = true;

    return callback(null, couchdb);
  });

  // report errors from couchdb
  couchdb.on('error', function (err) {

    if (!started) {
      return callback(err); // pass startup error to callback
    } else {
      // log couchdb errors after server is started
      console.log('CouchDB Error: %j', err);
    }
  });

  // shutdown the couch server if the maps-app server is stopped
  process.on('exit', function (code) {
    exports.stop(couchdb, function () {
      process.exit(code);
    });
  });

  // on ctrl-c, stop couchdb first, then exit.
  process.on('SIGINT', function () {
    console.log(['sigint', arguments]);
    exports.stop(couchdb, function () {
      process.exit(0);
    });
  });

  // handle SIGTERM gracefully as well
  process.on('SIGTERM', function () {
    console.log(['sigterm', arguments]);
    exports.stop(couchdb, function () {
      process.exit(0);
    });
  });

  couchdb.start();

};

/**
 * Stops the provided CouchDB server
 */

exports.stop = function (couchdb, callback) {
  console.log('\nStopping CouchDB...');
  couchdb.once('stop', callback);
  couchdb.stop();
};

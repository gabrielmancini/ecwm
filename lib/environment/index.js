/**
 * This module returns appropriate config values for the provided
 * platform, environment and project. It is used directly by the start
 * script in the bin directory.
 */

var url = require('url');
var path = require('path');
var _ = require('lodash');


getCouch = function (env) {

  var couch = {
    run: true // start local couch
  };

  // if COUCH_URL is set in the environment,
  // we don't attempt to start our own instance
  // of CouchDB, but just use the one provided
  // to us there.

  if (env.COUCH_URL) {
    couch.url = env.COUCH_URL;
    couch.run = false;
    return couch;
  }

  return couch;
};

exports.getConfig = function (platform, env, cwd, argv) {

  // location of project's package.json
  var pkgfile = require(cwd + '/package.json');

  // default platform-agnostic config
  var env_config = {

    couch: getCouch(env),
    project_dir: cwd,
    api_root: path.resolve(path.join(cwd, 'api')),

    host: env.BIND_ADDRESS || '127.0.0.1',
    app: pkgfile,
    domain: 'dev',
    verbose: false,
    platform: platform,
    id: pkgfile.name,
    maps: {
      env: env,
      app_path: path.resolve(cwd),
      www_path: path.resolve(path.join(cwd, 'www')),
      data_path: path.resolve(path.join(cwd, 'data'))
    },
    db: 'routes'
  };

  if (argv.hasOwnProperty('verbose') || argv.hasOwnProperty('v')) {
    env_config.verbose = true;
  }

 // option to configure custom ports
  if (argv.hasOwnProperty('custom-ports')) {
    var c_ports = argv['custom-ports'].split(',').reduce(function (memo, port) {
      port = parseInt(port, 10);
      if (port > 0) {
        memo.push(port);
      }
      return memo;
    }, []);
    if (c_ports.length === 2) {
      env_config.api_port = c_ports[0];
      env_config.couch.port = c_ports[1];
    } else {
      throw new Error('custom-ports option must contain 2 ports separated by ' +
                      'commas, ie: --custom-ports 7777,8888');
    }
  } else {
    env_config.api_port = ports.getPort(env_config.id + '-api');
  }

  env_config.api_link = function () {
    return 'http://' + env_config.host + ':' + env_config.api_port;
  };

  if (!env.COUCH_URL && !argv.hasOwnProperty('custom-ports')) {
    env_config.couch.port = env_config.id + '-couch';
  }

  if (env.SETUP_PASSWORD) {
    env_config.admin_password = env.SETUP_PASSWORD;
  }


  if (!env_config.couch.url) {
    env_config.couch.url = 'http://' + env_config.host + ':' + env_config.couch.port;
  }
  // get the host for couchb url
  var parsed = url.parse(env_config.couch.url);

  env_config.couch.host = parsed.hostname;
  env_config.couch.port = parsed.port || 5984;

  return env_config;
};

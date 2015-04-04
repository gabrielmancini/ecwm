/**
 * Serves proxies /_api requests to couchdb
 */

var Hapi = require('hapi');
var routes = require('../../core/routes');
var plugins = require('../plugin');


exports.start =  function (env_config, callback) {

  var server = new Hapi.Server();

  server.connection({
    port: env_config.api_port,
    routes: {
      cors: true,
      payload: {
        maxBytes: 1048576 * 10 // 10 MB
      }
    }
  });

  server.path(env_config.maps.www_path);

  server.route(routes(env_config));

  server.register(plugins.lout, function (err) {
    err && console.log('Plugin lout err: ', err);
  });

  server.start(function () {
    console.log('Api:   ', env_config.api_link());
    console.log('Docs: ', env_config.api_link() + '/docs');

    return callback(null, server);
  });

};


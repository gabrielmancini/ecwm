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

  server.route(routes);

  var pluginsArray = Object.keys(plugins).map( function (k) {
    return plugins[k];
  });

  server.register(plugins['upload-stream'], function (err) {
    err && console.log('Plugin upload-stream err: ', err);
  });

  server.register(plugins.lout, function (err) {
    err && console.log('Plugin lout err: ', err);
  });

  server.start(function () {
    console.log('Api:   ', env_config.api_link());
    console.log('Docs: ', env_config.api_link() + '/docs');

    return callback(null, server);
  });

};

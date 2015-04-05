
module.exports = function (env_config) {

  return {
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: env_config.maps.www_path,
            listing: true
        }
    }
  };

}

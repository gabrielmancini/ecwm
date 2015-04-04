module.exports = function (env_config) {
  var objctRoutes = require('requireindex')(__dirname);
  var routes = Object.keys(objctRoutes).map(function (k) {
    return objctRoutes[k](env_config);
  })
  return routes;
};

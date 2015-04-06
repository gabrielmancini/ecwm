(function(){

  'use strict';

  angular
    .module('module.maps')
    .factory('MapService', Service);


  /**
   * Main Service for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  Service.$inject = [
          '$http',
          '$log',
          '$q',
        ];
  function Service($http, $log, $q) {

    return {
        getFiles: getFiles,
        getOrigins: getOrigins,
        getDestinies: getDestinies,
        getPath: getPath
    };

    function getFiles() {
      return $http.get('/api/maps')
          .then(getFilesComplete)
          .catch(getFilesFailed);

      function getFilesComplete(response) {
          return response.data.rows || [];
      }

      function getFilesFailed(error) {
          $log.error('XHR Failed for getFiles.' + error.data);
      }
    }

    function getOrigins(query) {
      return $http.get('/api/from?q=' + query)
          .then(getOriginsComplete)
          .catch(getOriginsFailed);

      function getOriginsComplete(response) {
          return response.data.rows || [];
      }

      function getOriginsFailed(error) {
          $log.error('XHR Failed for getFiles.' + error.data);
      }
    }

    function getDestinies(query) {
      return $http.get('/api/to?q=' + query)
          .then(getDestiniesComplete)
          .catch(getDestiniesFailed);

      function getDestiniesComplete(response) {
          return response.data.rows || [];
      }

      function getDestiniesFailed(error) {
          $log.error('XHR Failed for getFiles.' + error.data);
      }
    }


    function getPath(start, final) {
      return $http.post('/api/dijkstras',  {from: start, to: final})
          .then(getPathComplete)
          .catch(getPathFailed);

      function getPathComplete(response) {
          return response.data;
      }

      function getPathFailed(error) {
          $log.error('XHR Failed for getPath.' + error.data);
      }
    }

  }

})();

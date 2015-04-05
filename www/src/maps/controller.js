(function(){
  'use strict';

  angular
    .module('module.maps')
    .controller('MapController', Controller);


  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  Controller.$inject = [
          '$scope',
          '$log',
          '$q',
          'MapService'
        ];
  function Controller($scope, $log, $q, mapService) {
    var vm = this;

    vm.files = [];
    vm.columnDefs = [
      { name:'file', field: 'key' },
      { name:'rows', field: 'value' }
    ];

    activate();

    function activate() {
      return getFiles().then(function() {
          $log.info('Activated Files View');
      });
    }

    function getFiles() {
      return mapService.getFiles()
          .then(function(data) {
            vm.files = data;
            return vm.files;
      });
    }

  }

})();

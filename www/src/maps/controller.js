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
          '$timeout',
          '$mdToast',
          '$animate',
          'FileUploader',
          'MapService'
        ];
  function Controller($scope, $log, $q, $timeout, $mdToast, $animate, FileUploader, mapService) {
    var vm = this;

    vm.files = [];
    vm.columnDefs = [
      { name:'file', field: 'key' },
      { name:'rows', field: 'value' }
    ];
    vm.uploader = new FileUploader({
        url: '/api/maps',
        formData: [{
          parameter: JSON.stringify({file: 'file' })
        }]
    });

    vm.origin = {
      selectedItem  : null,
      searchText    : null,
      querySearch   : getOrigins,
      simulateQuery : true,
      isDisabled    : false,
    };

    vm.destiny = {
      selectedItem  : null,
      searchText    : null,
      querySearch   : getDestinies,
      simulateQuery : true,
      isDisabled    : false,
    };

    vm.findPath = findPath;
    vm.way = '';
    vm.mkl = 2.50;
    activate();

    //-----------------------------------------------------

    function activate() {
      return getFiles().then(function() {
          $log.info('Activated Files View');
      });
    }

    function findPath() {
      var origin = (!!vm.origin.selectedItem) ? vm.origin.selectedItem.key : vm.origin.searchText;
      var destiny = (!!vm.destiny.selectedItem) ? vm.destiny.selectedItem.key : vm.destiny.searchText;

      return mapService.getPath(origin, destiny)
        .then(function(data) {
          var distance = data.reduce(function (a, c) {
            return { priority: (a.priority + c.priority) };
          }, {priority: 0}).priority;

          var path = data.reduce(function (a, c) {
            a.push(c.key);
            return a;
          }, []);

          vm.way = path.join(' >> ') + ' on of cost: R$ ' + (distance / vm.mkl) ;
          if (!$scope.$$phase) $scope.$apply();
        return data;
      });
    }

    function getFiles() {
      return mapService.getFiles()
          .then(function(data) {
            vm.files = data;
            return vm.files;
      });
    }
    function getOrigins(query) {
          return mapService.getOrigins(query)
              .then(function(data) {
                return data;
          });
        }
    function getDestinies(query) {
          return mapService.getDestinies(query)
              .then(function(data) {
                return data;
          });
        }

    vm.uploader.onAfterAddingFile = function(fileItem) {
      vm.uploader.formData = [{
        parameter: JSON.stringify({name: fileItem._file.name })
      }];
    };

    vm.uploader.onBeforeUploadItem = function(item) {
      $mdToast.show(
        $mdToast.simple()
          .content('Upload Concluido')
          .position('top center')
          .hideDelay(300)
      );
    };

  }

})();

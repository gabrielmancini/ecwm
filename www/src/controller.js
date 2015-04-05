(function(){
  'use strict';

  angular
    .module('app.module')
    .controller('AppController', AppController);


  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  AppController.$inject = [
          '$scope',
          '$location',
          '$log',
        ];
  function AppController($scope, $location, $log) {
    var vm = this;

    vm.selectedIndex = 0;

    $scope.$watch('vm.selectedIndex', function(current, old) {
      switch(current) {
        case 0: $location.url('/view1'); break;
        case 1: $location.url('/view2'); break;
        case 2: $location.url('/view3'); break;
      }
    });



  }

})();

(function(){

  angular
       .module('app')
       .controller('AppController', [
          '$mdSidenav',
          '$mdBottomSheet',
          '$log',
          '$q',
          'appService',
          AppController
       ]);

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  function AppController($mdSidenav, $mdBottomSheet, $log, $q, appService) {
    var self = this;

    self.selected     = null;
    self.app        = [ ];
    self.selectApp   = selectApp;
    self.toggleList   = toggleAppsList;
    self.share        = share;

    // Load all registered app

    appService
          .loadAllApps()
          .then( function( app ) {
            self.app    = [].concat(app);
            self.selected = app[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    function toggleAppsList() {
      var pending = $mdBottomSheet.hide() || $q.when(true);

      pending.then(function(){
        $mdSidenav('left').toggle();
      });
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectApp ( app ) {
      self.selected = angular.isNumber(app) ? $scope.app[app] : app;
      self.toggleList();
    }

  }

})();

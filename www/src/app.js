(function(){
  'use strict';

  angular
    .module('app', [
      'ngMaterial',
      'ui.grid',
      'ngRoute',
      'angularFileUpload',
      'app.module'
    ])
    .config(['$mdThemingProvider', '$mdIconProvider',
      function ($mdThemingProvider, $mdIconProvider) {

        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('light-blue');
      }
    ])
    .config(['$routeProvider',
      function ($routeProvider) {
        $routeProvider
          .when('/view1', {
            templateUrl: 'src/partials/view1.html',
            controller: 'MapController as vm'
          })
          .when('/view2', {
            templateUrl: 'src/partials/view2.html',
            controller: 'MapController as vm'
          })
          .when('/view3', {
            templateUrl: 'src/partials/view3.html',
            controller: 'MapController as vm'
          })
          .otherwise({redirectTo: '/view3'});
      }
    ])
    ;

  var appElement = document.getElementsByTagName('html')[0];
  angular.element(document).ready(function () {
    angular.bootstrap(appElement, ['app']);
  });

})();

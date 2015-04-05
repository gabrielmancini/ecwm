angular
  .module('app', [
    'ngMaterial',
    'app.module'
  ])
  .config(function ($mdThemingProvider, $mdIconProvider) {

    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('red');

  });

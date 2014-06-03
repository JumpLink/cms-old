
if (typeof jumplink === 'undefined') {
  var jumplink = {};
}

jumplink.cms = angular.module('jumplink.cms', [
  'ngRoute'
  , 'ngAnimate'
  , 'ngSanitize'
  , 'ngTouch'
  , 'mgcrea.ngStrap'
  , 'ngSails'
  // , 'colorpicker.module'
  , 'angular-underscore'
  , 'toggle-switch'
  //, 'lrNotifier'
  // , 'snap'
  , 'angular-carousel'
  , 'contenteditable'
  , 'pascalprecht.translate'
  , 'Decorators' // WORKAROUND see workaround.js
  , 'angularSmoothscroll'
  , 'chieffancypants.loadingBar'
  , 'leaflet-directive'
  //, 'btford.socket-io'
 // , 'jumplink.cms.SocketController' 
]);

// I just inject empty $anchorScroll that does nothing. I do this because I use angularSmoothscroll for thinks like that
jumplink.cms.value('$anchorScroll', angular.noop);

jumplink.cms.run(function ($rootScope, ConfigService) {
    ConfigService.setConfigHttp();
});

jumplink.cms.config(function ($translateProvider, cfpLoadingBarProvider) {
  $translateProvider.useUrlLoader('/translation');
  $translateProvider.preferredLanguage('en');

  cfpLoadingBarProvider.includeSpinner = true;
  cfpLoadingBarProvider.includeBar = true;

  // $locationProvider.html5Mode(true);
});
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
  , 'lrNotifier'
  // , 'snap'
  , 'angular-carousel'
  , 'contenteditable'
  , 'pascalprecht.translate'
  , 'Decorators' // WORKAROUND see workaround.js
]);

var mapding = angular.module('mapding', [
  
]);

jumplink.cms.config(function ($translateProvider) {
  $translateProvider.useUrlLoader('/translation');
  $translateProvider.preferredLanguage('de');
});
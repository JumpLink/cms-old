if (typeof jumplink === 'undefined') {
  var jumplink = {};
}

jumplink.cms = angular.module('jumplink.cms', [
  'ngRoute'
  , 'ngAnimate'
  , 'ngSanitize'
  , 'ngTouch'
  , 'mgcrea.ngStrap'
  , 'gettext'
  , 'ngSails'
  , 'colorpicker.module'
  , 'angular-underscore'
  , 'toggle-switch'
  , 'lrNotifier'
  , 'snap'
  , 'angular-carousel'
]);

// languages
jumplink.cms.run(function (gettextCatalog) {
    gettextCatalog.currentLanguage = 'de'; // default language
    gettextCatalog.debug = true; // Highlighting untranslated strings
});
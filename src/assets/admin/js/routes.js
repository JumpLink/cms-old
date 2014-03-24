jumplink.cms.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/translations', {
        templateUrl: 'admin/content/translations.jade'
        , controller: 'TranslationController'
      })
      .when('/users', {
        templateUrl: 'admin/content/users.jade'
        , controller: 'UsersController'
      })
      .when('/settings', {
        templateUrl: 'admin/content/settings.jade'
        , controller: 'SettingsController'
      })
      .when('/:site', {
        templateUrl: 'content/site.jade'
        , controller: 'SiteController'
      })
      ;
  }]);
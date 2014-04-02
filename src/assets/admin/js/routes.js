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
      .when('/404', {
        templateUrl: 'content/404.jade'
        , controller: 'SiteController'
      })
      .when('/:site', {
        templateUrl: 'content/site.jade'
        , controller: 'SiteController'
        , reloadOnSearch: false
      })
      .when('/', {
        templateUrl: 'content/site.jade'
        , controller: 'SiteController'
        , reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });
      ;
  }]);
jumplink.cms.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
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
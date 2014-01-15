jumplink.cms.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/:site', {
        templateUrl: 'content/site.jade',
        controller: 'SiteController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
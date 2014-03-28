jumplink.cms.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/:site', {
        templateUrl: 'content/site.jade'
        , controller: 'SiteController'
        , reloadOnSearch: false
        // , resolve:  {
        //   config: function(ConfigService) {
        //     return ConfigService.getConfig();
        //   }
        // }
      })
      ;
  }]);
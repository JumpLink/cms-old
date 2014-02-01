jumplink.cms.controller('HeadController', function($scope, $sails, $routeParams) {

});

jumplink.cms.controller('NavbarController', function($scope, $sails, $routeParams) {

});

jumplink.cms.controller('SiteController', function($rootScope, $scope, $sails, $routeParams) {

  // only run this function when $rootScope.site is set
  var routeChanged = function () {
    var active = getActiveSite($rootScope.sites, $routeParams.site);
    $rootScope.site = active.site;
    $rootScope.siteIndex = active.index;
    $rootScope.active = getActiveNavigation($rootScope.site);
  }

  var getSites = function () {
    $sails.get("/site", function (response) {
      if(response != null && typeof(response) !== "undefined") {
        $rootScope.sites = response;
        $rootScope.navigation = getNavigation($rootScope.sites);
        routeChanged();
        $rootScope.active = getActiveNavigation($rootScope.site);    
      } else {
        // TODO redirect
        console.log ("Can't load Sites");
      }
    });
  }

  var getConfig = function () {
    $sails.get("/config/example", function (response) {
      if(response != null && typeof(response) !== "undefined") {
        $rootScope.config = response;
        console.log($rootScope.config);
      } else {
        console.log ("Can't load Config");
      }
    });
  }

  // TODO redirect if active site not found
  var getActiveSite = function (sites, route) {
    if(typeof sites !== 'undefined' && sites.length > 0) {
      for (var i = 0; i < sites.length; i++) {
        if(sites[i] !== null && sites[i].href == route)
          return {site: sites[i], index: i};
      };
    }
    return null;
  }

  var getNavigation = function (sites) {
    if(typeof sites !== 'undefined') {
      var result = [];
      for (var i = 0; i < sites.length; i++) {
        if(sites[i] !== null)
          result.push({name: sites[i].name, href: sites[i].href});
      };
      return result;
    }
    return [];
  }

  var getActiveNavigation = function (site) {
    return getNavigation([site])[0];
  }

  // get sites only if they are currently not defined
  if($rootScope.sites === null || typeof($rootScope.sites) === "undefined" || typeof($rootScope.sites.length) === "undefined" || $rootScope.sites.length <= 0) {
    getSites();
  } else {
    // otherwise just update the active site
    routeChanged();
  }

  // get sites only if they are currently not defined
  if($rootScope.config === null || typeof($rootScope.config) === "undefined") {
    getConfig();
  }

});

jumplink.cms.controller('RowController', function($scope, $element, $compile, $sails, $routeParams) {
  //console.log($scope.index);

});

jumplink.cms.controller('ColumnController', function($rootScope, $scope) {


});

jumplink.cms.controller('CarouselController', function($scope, $sails, $routeParams) {
  $scope.index=0;

  $scope.next = function () {
    if($scope.index+1 === $scope.carousel.slides.length)
      $scope.index = 0;
    else
      $scope.index++;
  }

  $scope.prev = function () {
    if($scope.index-1 < 0)
      $scope.index = $scope.carousel.slides.length-1;
    else
      $scope.index--;
  }

});
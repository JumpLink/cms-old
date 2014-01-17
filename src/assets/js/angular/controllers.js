jumplink.cms.controller('HeadController', function($scope, $sails, $routeParams) {

});

jumplink.cms.controller('NavbarController', function($scope, $sails, $routeParams) {

  // //  // TODO get all sites
  // $sails.get("/site/example", function (response) {
  //   if(response != null && typeof(response) !== "undefined") {
  //     $scope.sites = response;
  //     //console.log ($scope.site);
  //   } else {
  //     console.log ("Can't load example");
  //   }
  // });
});

jumplink.cms.controller('SiteController', function($rootScope, $scope, $sails, $routeParams) {

  // If site is passed in the url
  if(typeof($routeParams.site) !== "undefined") {
    $scope.routeSite = $routeParams.site;
  }

   // TODO get site by name
  $sails.get("/site/example", function (response) {
    if(response != null && typeof(response) !== "undefined") {
      $rootScope.site = response[0];
      $rootScope.sites = response;
      $rootScope.navigation = getNavigation($rootScope.sites);
      $rootScope.active = getActiveNavigation($rootScope.site);
      //console.log ($scope.site);
    } else {
      console.log ("Can't load example");
    }
  });

  $sails.get("/config/example", function (response) {
    if(response != null && typeof(response) !== "undefined") {
      $scope.config = response;
      //console.log ($scope.config);
    } else {
      console.log ("Can't load example");
    }
  });

  var getNavigation = function (sites) {
    if(typeof sites !== 'undefined') {
      var result = [];
      for (var i = 0; i < sites.length; i++) {
        result.push({name: sites[i].name, href: sites[i].href});
      };
      return result;
    }
    return [];
  }

  var getActiveNavigation = function (site) {
    return getNavigation([site])[0];
  }

});

jumplink.cms.controller('RowController', function($scope, $element, $compile, $sails, $routeParams) {
  //console.log($scope.index);

});

jumplink.cms.controller('ColumnController', function($scope, $element, $compile, $sails, $routeParams) {
  $scope.getImagePosition = function (image) {
    if(typeof image == 'undefined' || typeof image.position == 'undefined' )
      return null;
    else
      switch(image.position) {
        case "top":
        case "bottum":
        case "left":
        case "right":
          return image.position;
        break;
        case "flip":
          if($scope.rowindex%2 == 0) // index gerade
            return "left";
          else
            return "right";
        break;
        default:
          return null;
        break;
      }
  }
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
    console.log($scope.index);

    if($scope.index-1 < 0)
      $scope.index = $scope.carousel.slides.length-1;
    else
      $scope.index--;
  }

});
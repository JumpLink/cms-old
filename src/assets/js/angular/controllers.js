jumplink.cms.controller('HeadController', function($scope, $sails, $routeParams) {


});

jumplink.cms.controller('SiteController', function($scope, $sails, $routeParams) {

  // If site is passed in the url
  if(typeof($routeParams.site) !== "undefined") {
    $scope.routeSite = $routeParams.site;
  }

  $sails.get("/site/example", function (response) {
    if(response != null && typeof(response.sites) !== "undefined") {
      $scope.site = response.sites[0];
      console.log ($scope.site);
    } else {
      console.log ("Can't load example");
    }
  });

});

jumplink.cms.controller('RowController', function($scope, $element, $compile, $sails, $routeParams) {


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
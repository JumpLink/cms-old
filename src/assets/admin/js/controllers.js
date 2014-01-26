jumplink.cms.controller('AdminNavbarController', function($scope, $rootScope, $sails, LoremService) {
  $scope.save = function () {
    console.log($rootScope.site);
    $sails.put("/site/"+$rootScope.site.id, $rootScope.site, function (response) {
      if(response != null && typeof(response) !== "undefined") {
        console.log (response);
      } else {
        console.log ("Can't save site");
      }
    });
  }

  $scope.removeParagraph = function (index) {
    if( angular.isDefined($rootScope.selected.column) )
      $rootScope.selected.column.paragraphs.pop();
  }

  $scope.addParagraph = function (index) {
    if( angular.isDefined($rootScope.selected.column) )
      $rootScope.selected.column.paragraphs.push({content: LoremService.generator({count: 3}), type: 'TODO' });
  }

});

jumplink.cms.controller('ColumnConfigButtonController', function($scope, $rootScope, $sails) {
  
});
jumplink.cms.controller('AdminNavbarController', function($scope, $rootScope, $sails, ParagraphService, RowService, ColumnService, SiteService) {
  $scope.save = function () {
    console.log($rootScope.site);
    $sails.put("/site/"+$rootScope.site.id, $rootScope.site, function (response) {
      if(response != null && typeof(response) !== "undefined") {
        console.log (response);
      } else {
        console.log ("Can't save site");
      }
    });
    // $sails.put("/site/replace/"+$rootScope.site.id, $rootScope.site, function (response) {
    //   if(response != null && typeof(response) !== "undefined") {
    //     console.log (response);
    //   } else {
    //     console.log ("Can't save site");
    //   }
    // });
  }

  $scope.removeParagraph = function () {
    if( angular.isDefined($rootScope.selected.column.paragraphs) )
      $rootScope.selected.column.paragraphs.pop();
  }

  $scope.addParagraph = function () {
    if( angular.isDefined($rootScope.selected.column.paragraphs) )
      $rootScope.selected.column.paragraphs.push(ParagraphService.getDefaults($rootScope.selected.column.type, null));
  }

  $scope.removeRow = function () {
    if( angular.isDefined($rootScope.selected.site.rows) )
      $rootScope.selected.site.rows.pop();
  }

  $scope.addRow = function () {
    if( angular.isDefined($rootScope.selected.site.rows) )
      $rootScope.selected.site.rows.push(RowService.getDefaults($rootScope.selected.site.type, null));
  }

  $scope.removeColumn = function () {
    if( angular.isDefined($rootScope.selected.row.columns) )
      $rootScope.selected.row.columns.pop();
  }

  $scope.addColumn = function () {
    if( angular.isDefined($rootScope.selected.row.columns) )
      $rootScope.selected.row.columns.push(ColumnService.getDefaults($rootScope.selected.row.type, null));
  }

  $scope.addSite = function () {
    if( angular.isDefined($rootScope.sites) )
      $rootScope.sites.push(SiteService.getDefaults("default", null, $rootScope.sites.length));
    console.log($rootScope.sites[$rootScope.sites.length-1]);
  }

});

jumplink.cms.controller('ColumnConfigButtonController', function($scope, $rootScope, $sails) {
  
});


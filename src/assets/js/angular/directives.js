jumplink.cms.directive("row", function ($compile) {
  return {
    restrict: "A",
    transclude: true,
    scope: {
      row: "="
      , index: "="
    },
    templateUrl: 'partials/row.jade',
    controller: 'RowController',
    link: function(scope, element, attr) {
    }
  }
});

jumplink.cms.directive("carousel", [function () {
  return {
    restrict: "A",
    scope: {
      carousel: "="
    },
    link: function(scope, element, attr) {
      //element.addClass(scope.row.type);
    },
    templateUrl: 'partials/carousel.jade',
    controller: 'CarouselController'
  }
}]);

jumplink.cms.directive("column", function ($compile) {
  return {
    restrict: "A",
    scope: {
      column: "="
      , index: "="
      , rowindex: "="
    },
    /*
     * To understand this, see:
     * * http://sporto.github.io/blog/2013/06/24/nested-recursive-directives-in-angular/#comment-991048825
     * * http://stackoverflow.com/questions/19125551/angularjs-understanding-a-recursive-directive
     */
    compile: function(tElement, tAttributes) {
      return function(scope, iElement, iAttributes, containerCtrl) {
        if( typeof scope.column.carousel !== 'undefined' ) {
          var new_carousel = '<div carousel="column.carousel"></div>';
          $compile(new_carousel)(scope, function(cloned, scope) {           
            iElement.find( ".carousel-placeholder" ).replaceWith(cloned);
          });
        }
      }
    },
    templateUrl: 'partials/column.jade',
    controller: 'ColumnController'
  }
});
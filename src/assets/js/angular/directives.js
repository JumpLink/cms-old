jumplink.cms.directive("jsNavbar", function ($compile, $window, $location, $navbar) {
  return {
    restrict: "A"
    // , scope: {
    //   container: "@"
    //   , inverse: "@"
    //   , type: "@"
    //   , sites: "@"
    // }
    , compile: function(tElement, tAttributes) {

      return function(scope, iElement, iAttributes, controller) {

        // observe for "inverse" attribute, if it is true, inverse the navbar
        iAttributes.$observe('inverse', function(inverse) {
          if(inverse === true || inverse === "true")
            iElement.addClass("navbar-inverse");
          else
            iElement.addClass("navbar-default");
        });

        // observe for "type" attribute, if it changed, add navbar class type of position
        iAttributes.$observe('type', function(type) {
          if(type !== null && type != "" && typeof type !== "undefined" && type !== "default")
            iElement.addClass("navbar-"+type);
        });

        // observe for "site" attribute, if it changed, rebuild the navigation
        iAttributes.$observe('container', function(container) {
          if(container == true || container == "true")
            iElement.find('.container-placeholder').addClass('container');
        }); 

        // observe for "site" attribute, if it changed, rebuild the navigation
        iAttributes.$observe('sites', function(sites) {
          if(typeof sites !== 'undefined' && typeof sites.length !== 'undefined' && sites.length > 0) {
            var sitesObject = angular.fromJson(sites);
            if(typeof sitesObject !== 'undefined' && typeof sitesObject[0] !== 'undefined' && typeof sitesObject[0].href !== 'undefined' && typeof sitesObject[0].name !== 'undefined' ) {
              var navigation = '';
              for (var i = 0; i < sitesObject.length && i < 20; i++) {
                navigation += '<li data-match-route='+sitesObject[i].href+'>  <a href="/#/'+sitesObject[i].href+'"> '+sitesObject[i].name+' </a> </li>';
              };

              // TODO compile not required?
              $compile(navigation)(scope, function(cloned, scope) {           
                iElement.find('#jl-navbar-nav').append(cloned);
              });
            } else {
              // console.log('error on js-navbar directive: "sites" attribute has no valid json');
            }
          } else {
            // console.log('error on js-navbar directive: You need to set the "sites" attribute');
          }
        });

        // observe for currently "active" site given as attribute, if it changed, reset the active class in the navigation 
        iAttributes.$observe('active', function(active) {
          if(typeof active !== 'undefined' && typeof active.length !== 'undefined' && active.length > 0) {
            var activeObject = angular.fromJson(active);
            if(typeof activeObject !== 'undefined' && typeof activeObject.href !== 'undefined' ) {
              var liElements = iElement[0].querySelectorAll('li[data-match-route]');
              angular.forEach(liElements, function(li) {
                var liElement = angular.element(li);
                var pattern = liElement.attr('data-match-route');
                if(activeObject.href == pattern)
                  liElement.addClass('active');
                else
                  liElement.removeClass('active');
              });
            } else {
              // console.log('error on js-navbar directive: "active" attribute has no valid json');
            }
          } else {
            // console.log('error on js-navbar directive: You need to set the "active" attribute');
          }
        });
      }
    }
    , templateUrl: 'partials/navbar.jade'
    , controller: 'NavbarController'
  }
});

jumplink.cms.directive("row", function ($compile) {
  return {
    restrict: "A",
    scope: {
      row: "="
      , index: "="
    },
    templateUrl: 'partials/row.jade',
    controller: 'RowController',
    link: function(scope, iElement, iAttributes) {
    }
  }
});

jumplink.cms.directive("carousel", function ($compile) {
  return {
    restrict: "A",
    scope: {
      carousel: "="
    },
    link: function(scope, iElement, iAttributes) {
      // use for loop instead of ng-repeat to avoid the "$rootScope:inprog" error
      var rnCarousel = ''
        +'<ul rn-carousel rn-carousel-indicator rn-carousel-index="index">';
          for (var i = 0; i < scope.carousel.slides.length; i++) {
            rnCarousel += ''
            +'<li class="item" style="height:'+scope.carousel.height+'px;background-image:url(/images/'+scope.carousel.slides[i].image.src+')">'
              +'<div class="carousel-caption">'
                +'<span row="carousel.slides['+i+'].row", index="'+i+'")"></span>'
              +'</div>'
            +'</li>';
          };
          rnCarousel += ''
        +'</ul>';

      $compile(rnCarousel)(scope, function(cloned, scope) {
        iElement.find('.carousel-inner').html(cloned);
      });
    },
    templateUrl: 'partials/carousel.jade',
    controller: 'CarouselController'
  }
});

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
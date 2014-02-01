jumplink.cms.directive("jsNavbar", function ($compile, $window, $location, $navbar, PolicyService) {
  return {
    restrict: "A"
    , scope: {
      inverse: "="
      , type: "="
      , container: "="
      , sites: "="
      , active: "="
    }
    , compile: function(tElement, tAttributes) {

      return function(scope, iElement) {

        var appendEditButtons = function () {
          var addSiteButton = '<li ng-click="addSite()"><a href=""><i class="fa fa-plus-circle"></i> add Site</a></li>';
          //var removeSiteButton = '<li ng-click="removeSite()"><a href=""><i class="fa fa-minus-circle"></i> remove Site</a></li>';
          
          // compile for ng-click
          $compile(addSiteButton)(scope, function(cloned, scope) {
            iElement.find('#jl-navbar-nav').append(cloned);
          });
        }

        scope.addSite = function () {
          console.log("TODO add site");
        }

        // observe for "inverse" attribute, if it is true, inverse the navbar
        scope.$watch('inverse', function(inverse) { 
          if(inverse === true || inverse === "true")
            iElement.addClass("navbar-inverse");
          else
            iElement.addClass("navbar-default");
        });

        // observe for "type" attribute, if it changed, add navbar class type of position
        scope.$watch('type', function(type) {
          if(type !== null && type != "" && typeof type !== "undefined" && type !== "default")
            iElement.addClass("navbar-"+type);
        });

        /*
         * observe for "container" attribute, if it changed, add or remove container class
         */
        scope.$watch('container', function(container) {
          if(container == true || container == "true")
            iElement.find('.container-placeholder').addClass('container');
          else
            iElement.find('.container-placeholder').removeClass('container');
        }); 

        /*
         * observe for "site" attribute, if it changed, rebuild the navigation
         * Render Navigation
         */
        scope.$watch('sites', function(sites) {
          if(typeof sites !== 'undefined' && typeof sites[0] !== 'undefined' && typeof sites[0].href !== 'undefined' && typeof sites[0].name !== 'undefined' ) {
            var navigation = '';
            for (var i = 0; i < sites.length && i < 20; i++) {
              navigation += '<li data-match-route='+sites[i].href+'>  <a href="#/'+sites[i].href+'"> '+sites[i].name+' </a> </li>';
            };
            iElement.find('#jl-navbar-nav').append(navigation);
            if (PolicyService.changeContentAllowed()) {
              appendEditButtons();
            }
          } else {
            // console.log('error on js-navbar directive: You need to set the "sites" attribute');
          }
        });

        // $watch for currently "active" site, if it changed, reset the active class in the navigation 
        scope.$watch('active', function(active) {
          if(typeof active !== 'undefined' && typeof active.href !== 'undefined') {
            var liElements = iElement[0].querySelectorAll('li[data-match-route]');
            angular.forEach(liElements, function(li) {
              var liElement = angular.element(li);
              var pattern = liElement.attr('data-match-route');
              if(active.href == pattern)
                liElement.addClass('active');
              else
                liElement.removeClass('active');
            });
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
    restrict: "A"
    , scope: {
      row: "="
      , index: "="
      , slideindex: "="
    }
    , templateUrl: 'partials/row.jade'
    , controller: 'RowController'
  }
});

jumplink.cms.directive("carousel", function ($compile, PolicyService) {
  return {
    restrict: "A"
    , scope: {
      carousel: "="
    }
    , link: function(scope, iElement, iAttributes) {

      scope.$watch('carousel.active', function(active, old, scope) {
        // console.log(active);
        if(active) {
          // use for loop instead of ng-repeat to avoid the "$rootScope:inprog" error
          var rnCarousel = ''
            +'<ul class="rn-carousel-slides" rn-carousel="true" rn-carousel-swipe="'+!PolicyService.changeContentAllowed()+'" rn-carousel-indicator="true" rn-carousel-index="index">';
              for (var i = 0; i < scope.carousel.slides.length; i++) {
                rnCarousel += ''
                +'<li class="item rn-carousel-slide" style="height:'+scope.carousel.height+'px;background-image:url(/images/'+scope.carousel.slides[i].image.src+')" >'
                  +'<div class="carousel-caption">'
                    +'<span row="carousel.slides['+i+'].row" index="'+i+'" slideindex="'+i+'")"></span>'
                  +'</div>'
                +'</li>';
              };
              rnCarousel += ''
            +'</ul>';

          $compile(rnCarousel)(scope, function(cloned, scope) {
            iElement.find('.carousel-inner').html(cloned);
          });
        }
      });

    }
    , templateUrl: 'partials/carousel.jade'
    , controller: 'CarouselController'
  }
});

jumplink.cms.directive("column", function ($rootScope, $compile, ColumnService, LoremService, PolicyService, ParagraphService) {
  return {
    restrict: "A"
    , scope: {
      column: "="
      , index: "="
      , rowindex: "="
    }
    /*
     * To understand this, see:
     * * http://sporto.github.io/blog/2013/06/24/nested-recursive-directives-in-angular/#comment-991048825
     * * http://stackoverflow.com/questions/19125551/angularjs-understanding-a-recursive-directive
     */
    , compile: function(tElement, tAttributes) {

      return function(scope, iElement, iAttributes) {

        scope.changeContentAllowed = PolicyService.changeContentAllowed;

        // set column defaults if unset
        scope.column = ColumnService.getDefaults(scope.$parent.row.type, scope.column);

        scope.getImagePosition = function (image) {
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
                if(scope.rowindex%2 == 0) // index gerade
                  return "left";
                else
                  return "right";
              break;
              default:
                return null;
              break;
            }
        };

        scope.imagePositionIs = function (position, image) {
          return scope.getImagePosition (image) === position && image.active;
        }

        scope.getImageContainerPaddingTop = function (image) {
          switch(scope.getImagePosition(image)) {
            case "left":
            case "right":
              return (image.height/4)+"px";
            break;
            case "top":
            case "bottum":
            default:
              return "0px";
            break;
          }
        };

        scope.selectColumn = function (rowIndex, columnIndex, column, row, slideIndex) {

          // console.log("Column select");
          // console.log("rowIndex: "+rowIndex);
          // console.log("columnIndex: "+columnIndex);
          // console.log("slideIndex: "+slideIndex);
          // console.log("column");
          // console.log(column);
          // console.log("row");
          // console.log(row);

          // Set latestSelect if possible
          if(typeof($rootScope.selected) !== 'undefined') {
            latestSelect = {};
            if(typeof($rootScope.selected.type) !== 'undefined')
              latestSelect.type = $rootScope.selected.type;

            if(typeof($rootScope.selected.site) !== 'undefined')
              latestSelect.site = $rootScope.selected.site;

            if(typeof($rootScope.selected.row) !== 'undefined')
              latestSelect.row = $rootScope.selected.row;

            if(typeof($rootScope.selected.column) !== 'undefined')
              latestSelect.column = $rootScope.selected.column;

            if(typeof($rootScope.selected.siteIndex) !== 'undefined')
              latestSelect.siteIndex = $rootScope.selected.siteIndex;

            if(typeof($rootScope.selected.rowIndex) !== 'undefined')
              latestSelect.rowIndex = $rootScope.selected.rowIndex;

            if(typeof($rootScope.selected.columnIndex) !== 'undefined')
              latestSelect.columnIndex = $rootScope.selected.columnIndex;

            if(typeof($rootScope.selected.slideIndex) !== 'undefined')
              latestSelect.slideIndex = $rootScope.selected.slideIndex;

          }

          // normal column or content of carousel-slide
          if(column.carousel.active === false) {

            // console.log("without carousel");

            $rootScope.selected = {
              type: 'column'
              , site: $rootScope.site
              , row: row
              , column: column
              , siteIndex: $rootScope.siteIndex
              , rowIndex: rowIndex
              , columnIndex: columnIndex
              , slideIndex: slideIndex
            }
          }

          /* 
           * Normal column but with carousel insite, but we want to choose the slide of the carousel,
           * because it was fired this function short time before (we see this on latestSelect.slideIndex ), so the user has clicked on a slide
           */
          if (column.carousel.active === true && typeof(slideIndex) === 'undefined' && typeof(latestSelect) !== 'undefined' && angular.isDefined(latestSelect.slideIndex) ) { 

            // console.log("with carousel");

            // NOTE on carousel rowidex === slideindex
            // the latest select was the select of the slide in the carousel
            var carousel = {
              type: 'carousel'
              , rowIndex: latestSelect.slideIndex
              , columnIndex:  latestSelect.columnIndex
              , slideIndex: latestSelect.slideIndex
            }

            carousel.row = column.carousel.slides[carousel.slideIndex].row;
            carousel.column = carousel.row.columns[carousel.columnIndex];

            $rootScope.selected = {
              type: 'column'
              , site: $rootScope.site
              , row: carousel.row
              , column: column
              , siteIndex: $rootScope.siteIndex
              , rowIndex: rowIndex
              , columnIndex: columnIndex
              , carousel: carousel
            }
          }

          /* 
           * Normal column but with carousel insite, we want not the slide, we want this column
           * because the slide was not choosen before, so the user has just click on the column, not in the slide.
           */
          if (column.carousel.active === true && typeof(slideIndex) === 'undefined' && (typeof(latestSelect) === 'undefined' || typeof(latestSelect.slideIndex) === 'undefined') ) { 
            $rootScope.selected = {
              type: 'column'
              , site: $rootScope.site
              , row: row
              , column: column
              , siteIndex: $rootScope.siteIndex
              , rowIndex: rowIndex
              , columnIndex: columnIndex
              , slideIndex: slideIndex
            }
          }
        };

        /*
         * paragraphs
         */
        var removeParagraphHtml = function () {
          var index = scope.column.paragraphs.length+1;
          var oldParagraph = iElement.find( ".paragraph-placeholder p:nth-child("+index+")" );
          oldParagraph.remove();
        }

        scope.getParagrapClass = function (index) {
          if(scope.column.paragraphs.length >= index+1) {
            return {
              'lead': scope.column.paragraphs[index].lead
              , 'text-left': scope.column.paragraphs[index].aligned == "left"
              , 'text-center': scope.column.paragraphs[index].aligned == "center"
              , 'text-right': scope.column.paragraphs[index].aligned == "right"
              , 'text-muted': scope.column.paragraphs[index].color == "muted"
              , 'text-info': scope.column.paragraphs[index].color == "info"
              , 'text-warning': scope.column.paragraphs[index].color == "warning"
              , 'text-danger': scope.column.paragraphs[index].color == "danger"
            }
          } else {
            return '';
          }
        }

        var getParagraphHtml = function (index) {
          return '<p contenteditable="{{changeContentAllowed()}}" no-line-breaks="true" strip-br="true" select-non-editable="false" ng-model="column.paragraphs['+index+'].content" ng-class="getParagrapClass('+index+')"></p>';
        }

        var addParagraphHtml = function () {
          var index = scope.column.paragraphs.length-1;
          //Set defaults
          scope.column.paragraphs[index] = ParagraphService.getDefaults(scope.column.type, scope.column.paragraphs[index]);
          if(scope.column.paragraphs[index].active) {
            //var new_paragraph = '<p contenteditable="{{changeContentAllowed()}}" no-line-breaks="true" strip-br="true" select-non-editable="false" ng-model="column.paragraphs['+index+'].content" class="'+scope.column.paragraphs[index].type+'"></p>';
            var new_paragraph = getParagraphHtml(index);
            $compile(new_paragraph)(scope, function(cloned, scope) {           
              iElement.find( ".paragraph-placeholder" ).append(cloned);
            });
          }
        }

        // first time to create the paragraphs, after that, use removeParagraph and addParagraph
        if( typeof scope.column.paragraphs !== 'undefined' && scope.column.paragraphs.length > 0 ) {
          var new_paragraphs = "";
          for (var i = 0; i < scope.column.paragraphs.length; i++) {
            if(scope.column.paragraphs[i].active) {
              //new_paragraphs += '<p contenteditable="{{changeContentAllowed()}}" no-line-breaks="true" strip-br="true" select-non-editable="false" ng-model="column.paragraphs['+i+'].content" class="'+scope.column.paragraphs[i].type+'"></p>';
              new_paragraphs += getParagraphHtml(i);
            }
              
          };
          if(new_paragraphs !== "")
            $compile(new_paragraphs)(scope, function(cloned, scope) {           
              iElement.find( ".paragraph-placeholder" ).html(cloned);
            });
        }

        scope.$watchCollection('column.paragraphs', function(newValue, oldValue) {

          if(angular.isDefined(newValue) && angular.isDefined(oldValue)) {
            if(newValue.length > oldValue.length) {
              addParagraphHtml();
            }

            if(newValue.length < oldValue.length) {
              removeParagraphHtml();
            }
          }

        });
      }
    }
    , templateUrl: 'partials/column.jade'
    , controller: 'ColumnController'
  }
});

jumplink.cms.directive("columnHeader", function () {
  return {
    restrict: "E"
    , templateUrl: 'partials/columnHeader.jade'
  }
});

jumplink.cms.directive("columnSubtext", function () {
  return {
    restrict: "E"
    , templateUrl: 'partials/columnSubtext.jade'
  }
});
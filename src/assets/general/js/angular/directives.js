jumplink.cms.directive("jsNavbar", function ($rootScope, $compile, $window, $location, $navbar, PolicyService) {
  return {
    restrict: "A"
    , scope: {
      active: "="
    }
    , templateUrl: 'partials/navbar.jade'
    , controller: 'NavbarController'
  }
});

jumplink.cms.directive("sidebar", function ($compile, $timeout, $rootScope, SiteService, $scrollspy) {
  return {
    restrict: "E"
    , templateUrl: 'partials/sidebar.jade'
    , controller: 'SidebarController'
  }
});

// Fork of bsScrollspy
jumplink.cms.directive('jlScrollspy', function($rootScope, debounce, dimensions, $scrollspy, $location, SiteService) {

  return {
    restrict: 'EAC',
    link: function postLink(scope, element, attr) {

      var options = {scope: scope};
      angular.forEach(['offset', 'target'], function(key) {
        if(angular.isDefined(attr[key])) options[key] = attr[key];
      });

      var scrollspy = $scrollspy(options);

      // Overwrite original $activateElement with custom function
      var _activateElement = scrollspy.$activateElement;
      scrollspy.$activateElement = function (element) {

        if(scrollspy !== null) {
          var activeTarget = element.target;
          var activeElement = scrollspy.$getTrackedElement(activeTarget);

          if(SiteService.checkReady() && activeTarget && activeElement) {

            if(activeTarget === attr.target) {
              // set hash to current position
              var hash = activeElement.target.substring(1); // remove first #
              $location.replace();
              $location.hash(hash);
              scope.$apply();
            }

            return _activateElement (element);
          }
        }
      }

      scrollspy.trackElement(options.target, element);

      scope.$on('$destroy', function() {
        scrollspy.untrackElement(options.target, element);
        scrollspy.destroy();
        options = null;
        scrollspy = null;
      });

    }
  };

});


jumplink.cms.directive("row", function ($compile, $timeout, $rootScope) {
  return {
    restrict: "A"
    , scope: {
      row: "="
      , index: "="
      , slideindex: "="
    }
    , link: function(scope, iElement, iAttributes) {
      // WORKAROUND $timeout with 0 delay as callback after directive is finished rendered, source:  https://stackoverflow.com/questions/12240639/angularjs-how-can-i-run-a-directive-after-the-dom-has-finished-rendering
      $timeout(function() {
        $rootScope.renderedRows++;
      },0)
    }
    , templateUrl: 'partials/row.jade'
    , controller: 'RowController'
  }
});

jumplink.cms.directive("carousel", function ($compile, $rootScope, PolicyService, SiteService) {
  return {
    restrict: "A"
    , scope: {
      carousel: "="
    }
    , link: function(scope, iElement, iAttributes) {

      var compileCarousel = function () {
        // $log.debug(active);
        if(scope.carousel.active) {
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
      }

      scope.$watch('carousel.active', function(active, old, scope) {
        compileCarousel();
      });

    }
    , templateUrl: 'partials/carousel.jade'
    , controller: 'CarouselController'
  }
});

jumplink.cms.directive("column", function ($rootScope, $compile, PolicyService, ParagraphService, ContentService) {
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

        //scope.changeContentAllowed = PolicyService.changeContentAllowed;

        scope.getImagePosition = function (image) {
          if(typeof image == 'undefined' || typeof image.position == 'undefined' )
            return null;
          else
            switch(image.position) {
              case "top":
              case "bottum":
              case "left":
              case "right":
              case "absolute":
              default:
                return image.position;
              break;
              case "flip":
                if(scope.rowindex%2 == 0) // index gerade
                  return "left";
                else
                  return "right";
              break;
            }
        };

        scope.imagePositionIs = function (position, image) {
          return scope.getImagePosition (image) === position && image.active;
        }

        // TODO Padding in höhe des column-wrapper elements und der browser-breite berechnen.
        // oder horizontal zentrieren, text und bild 
        scope.getImageContainerPaddingTop = function (image) {
          switch(scope.getImagePosition(image)) {
            case "left":
            case "right":
              // return (image.height/4)+"px";
              return "0px";
            break;
            case "top":
            case "bottum":
            case "absolute":
            default:
              return "0px";
            break;
          }
        };

        scope.selectColumn = function (rowIndex, columnIndex, column, row, slideIndex) {

          if(!angular.isDefined($rootScope.selected))
            $rootScope.selected = {};

          // $log.debug("Column select");
          // $log.debug("rowIndex: "+rowIndex);
          // $log.debug("columnIndex: "+columnIndex);
          // $log.debug("slideIndex: "+slideIndex);
          // $log.debug("column");
          // $log.debug(column);
          // $log.debug("row");
          // $log.debug(row);

          // Set latestSelect if possible
          if(typeof($rootScope.selected) !== 'undefined') {
            latestSelect = {};

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
            $rootScope.selected.site = $rootScope.sites[$rootScope.active.index];
            $rootScope.selected.row = row;
            $rootScope.selected.column = column;
            $rootScope.selected.siteIndex = $rootScope.active.index;
            $rootScope.selected.rowIndex = rowIndex;
            $rootScope.selected.columnIndex = columnIndex;
            $rootScope.selected.slideIndex = slideIndex;
          }

          /* 
           * Normal column but with carousel insite, but we want to choose the slide of the carousel,
           * because it was fired this function short time before (we see this on latestSelect.slideIndex ), so the user has clicked on a slide
           */
          if (column.carousel.active === true && typeof(slideIndex) === 'undefined' && typeof(latestSelect) !== 'undefined' && angular.isDefined(latestSelect.slideIndex) ) { 

            // $log.debug("with carousel");

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

            // $rootScope.selected = {
            //   type: 'column'
            //   , site: $rootScope.site
            //   , row: carousel.row
            //   , column: column
            //   , siteIndex: $rootScope.siteIndex
            //   , rowIndex: rowIndex
            //   , columnIndex: columnIndex
            //   , carousel: carousel
            // }
            $rootScope.selected.site = $rootScope.sites[$rootScope.active.index];
            $rootScope.selected.row = row;
            $rootScope.selected.column = column;
            $rootScope.selected.siteIndex = $rootScope.siteIndex;
            $rootScope.selected.rowIndex = rowIndex;
            $rootScope.selected.columnIndex = columnIndex;
            $rootScope.selected.carousel = carousel;

          }

          /* 
           * Normal column but with carousel insite, we want not the slide, we want this column
           * because the slide was not choosen before, so the user has just click on the column, not in the slide.
           */
          if (column.carousel.active === true && typeof(slideIndex) === 'undefined' && (typeof(latestSelect) === 'undefined' || typeof(latestSelect.slideIndex) === 'undefined') ) { 
            $rootScope.selected.site = $rootScope.sites[$rootScope.active.index];
            $rootScope.selected.row = row;
            $rootScope.selected.column = column;
            $rootScope.selected.siteIndex = $rootScope.siteIndex;
            $rootScope.selected.rowIndex = rowIndex;
            $rootScope.selected.columnIndex = columnIndex;
            $rootScope.selected.slideIndex = slideIndex;
          }
        };

        /*
         * paragraphs
         */
        scope.selectParagraph = function (index, paragraph) {
          if(!angular.isDefined($rootScope.selected))
            $rootScope.selected = {};
          $rootScope.selected.paragraph = paragraph;
          $rootScope.selected.paragraphIndex = index;
        }

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
          return '<p ng-if="column.paragraphs_active" ng-click="selectParagraph('+index+', column.paragraphs['+index+'])" contenteditable="{{$root.changeContentAllowed()}}" no-line-breaks="false" strip-br="true" select-non-editable="false" ng-model="column.paragraphs['+index+'].content.langs[$root.selectedLanguage]" ng-class="getParagrapClass('+index+')"></p>';
        }

        var addParagraphHtml = function () {
          var index = scope.column.paragraphs.length-1;
          //Set defaults
          scope.column.paragraphs[index] = ParagraphService.getDefaults(scope.column.type, scope.column.paragraphs[index]);
          if(scope.column.paragraphs[index].active) {
            var new_paragraph = getParagraphHtml(index);
            $compile(new_paragraph)(scope, function(cloned, scope) {           
              iElement.find( ".paragraph-placeholder" ).append(cloned);
            });
          }
        }

        // first time to create the paragraphs, after that, use removeParagraph and addParagraph
        if( angular.isDefined(scope.column) && angular.isDefined(scope.column.paragraphs) && scope.column.paragraphs.length > 0 ) {
          var new_paragraphs = "";
          for (var i = 0; i < scope.column.paragraphs.length; i++) {
            if(scope.column.paragraphs[i].active) {
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

jumplink.cms.directive("languageSelect", function () {
  return {
    restrict: "E"
     , templateUrl: 'partials/languageSelectButton.jade'
    , controller: 'LanguageController'
  }
});

jumplink.cms.directive("columnButton", function () {
  return {
    restrict: "E"
    , scope: {
      button: "="
      , modal: "="
    }
    , templateUrl: 'partials/columnButton.jade'
    , controller: 'ColumnButtonController'
  }
});
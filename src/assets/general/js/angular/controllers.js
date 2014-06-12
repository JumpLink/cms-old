jumplink.cms.controller('LanguageController', function ($scope, $rootScope, $translate, $log) {

  var rewriteLanugageList = function (newValues) {
    $rootScope.languages = [];
    angular.forEach(newValues, function(lang, index){
      $rootScope.languages.push({value: lang, label: $translate('LANGCODE_'+lang.toUpperCase())});
      //- WORKAROUND, please uncommit when bug is fixed: WORKAROUND, see https://github.com/mgcrea/angular-strap/issues/378
      //- $rootScope.languages.push({value: lang, label: '<i class="flag f16 '+lang+'"></i> '+$translate('LANGCODE_'+lang.toUpperCase())});
    });
  }

  // TODO watch for translation changes?
  $rootScope.$watch('config.languages.active', function(newValues, oldValues) {
    if(angular.isDefined(newValues)) {
      rewriteLanugageList(newValues);
    }
  });

  var findInArray = function (langs, target) {
    var found = false;
    angular.forEach(langs, function(lang, index){
      if(lang === target)
        found = true;
    });
    return found;
  }

  // set default language
  $rootScope.$watch('config.languages.default', function (newValues, oldValues) {

    if(angular.isDefined(newValues) && newValues.length >= 2) {
      // set to default language only if selectedLanguage is not choosen before
      if(angular.isUndefined($rootScope.selectedLanguage)) {

        // if $rootScope.config.languages.default is defined and string-length greater than 2 and default language is one of the activated languages
        if(findInArray($rootScope.config.languages.active, newValues)) {
          $rootScope.selectedLanguage = newValues;
        } else {
          // fallback
          if(angular.isDefined($rootScope.config) && angular.isDefined($rootScope.config.languages) && angular.isDefined($rootScope.config) && angular.isArray($rootScope.config.languages.active))
            $rootScope.selectedLanguage = $rootScope.config.languages.active[0];
          else
            $rootScope.selectedLanguage = "en";
        }
      }
    }

  });

  $rootScope.$watch('selectedLanguage', function (newValues, oldValues) {
    if(angular.isDefined(newValues) && newValues.length >= 2) {
      $translate.uses(newValues).then(function (key) {
        if(angular.isDefined($rootScope.config)) {
          rewriteLanugageList($rootScope.config.languages.active);
        }
        // $log.debug("Sprache zu " + key + " gewechselt.");
      }, function (key) {
        $log.error("Can't switch language");
      });
    }
  });

});

jumplink.cms.controller('BodyController', function($scope, $rootScope, NavbarService) {
  $scope.topNavbarIsFixed = NavbarService.topNavbarIsFixed;
  $scope.bottomNavbarIsFixed = NavbarService.bottomNavbarIsFixed;
});

jumplink.cms.controller('HeadController', function($rootScope) {
  $rootScope.title = "JumpLink CMS";

  $rootScope.$watch('active.index', function(newValue, oldValue, scope) {
    if(angular.isDefined($rootScope.sites))
      $rootScope.title = $rootScope.sites[newValue].name;
  });

});

jumplink.cms.controller('NavbarController', function($scope, $rootScope, $location, cfpLoadingBar) {
  $scope.isActiveClass = function (index) {
    return angular.isDefined($rootScope.active) && angular.isDefined($rootScope.active.index) && $rootScope.active.index === index;
  } 
});

jumplink.cms.controller('SidebarController', function($rootScope, $scope, ContentService, SiteService) {

  $scope.subcategories = [];

  var columnIsDefined = function (row) {
    return angular.isDefined(row.columns) && angular.isArray(row.columns);
  }

  var isSubcategory = function (column) {
    return angular.isDefined(column.header) && column.header.active === true && column.header.subcategory === true;
  }

  var setSubcategories = function (activeSiteIndex) {
    angular.forEach(SiteService.getCurrentSite().rows, function(row, index) {
      if(columnIsDefined(row)) {
        // if is top subcategory
        angular.forEach(row.columns, function(column, index) {
          if(isSubcategory(column)) {
            if(column.header.size <= 1) {
              $scope.subcategories.push({target: ContentService.getID(column.header.content), content: column.header.content, children:[]});
            // if is lower subcategory  
            } else if(column.header.size >= 2) {
              if($scope.subcategories.length > 0) {
                $scope.subcategories[$scope.subcategories.length - 1].children.push({target: ContentService.getID(column.header.content), content: column.header.content});
              }
            }
          }
        });
      }
    });
  }

  var resetSubcategories = function (index) {
    if(angular.isDefined(index)) {
      setSubcategories(index);
    }
  }

  // TODO same for row.header changes
  $rootScope.$watch('active.index', function (newValues, oldValues) {
    if(angular.isDefined(newValues))
      resetSubcategories(newValues);
  });

});

jumplink.cms.controller('SiteController', function($rootScope, $scope, $sails, $routeParams, $window, $log, $location, SiteService, WindowService, cfpLoadingBar, PolicyService) {

  // If true all rows are rendered
  $rootScope.ready = false;

  $rootScope.renderedRows = 0;

  $rootScope.changeContentAllowed = PolicyService.changeContentAllowed;

  angular.element($window).bind('resize', function () {
    //$log.debug('resize tiggered');
    WindowService.autoPosition();
  });

  $scope.smoothScrollPosition = WindowService.smoothScrollPosition

  $scope.sidebarActive = function () {
    return SiteService.checkReady() && SiteService.getCurrentSite().sidebar;
  }

  $rootScope.$watch('renderedRows', function (newValue, oldValue) {
    var _complete = 0;

    if(angular.isDefined($rootScope.sites) && angular.isDefined($rootScope.active)) {
      var countOfRows = SiteService.getRowLength(SiteService.getCurrentSite());
      //_complete = $rootScope.renderedRows / SiteService.getCurrentSite().rows.length;
      _complete = $rootScope.renderedRows / countOfRows;
    }

    if(_complete < 1) {
      $rootScope.complete = _complete;
    } else {
      $rootScope.complete = 1;
    }

    $rootScope.ready = SiteService.checkReady();
  });

  if(cfpLoadingBar.status() <= 0);
    cfpLoadingBar.start();

  $rootScope.$watch('complete', function (newValue, oldValue) {
    if(newValue <= 0) {

    } else if(newValue < 1) {
      cfpLoadingBar.set(newValue);
    } else if(newValue >= 1) {
      cfpLoadingBar.complete();
    }
  });

  // only run this function when $rootScope.site is set
  var setSiteByRoute = function () {

    //WindowService.smoothScrollPosition(0, false);

    // found active site
    foundSiteByRoute($rootScope.sites, $routeParams.site, function (error, active) {
      
      if(error !== null) {
        $log.error(error);

        // fallback
        if(angular.isDefined($rootScope.sites) && angular.isArray($rootScope.sites) && angular.isDefined($rootScope.sites[0].href))
          $location.path( "/"+ $rootScope.sites[0].href );

      } else {
        if(angular.isUndefined($rootScope.active) || $rootScope.active !== active.index)
          $rootScope.active = {
            index: active.index
          };
      }
  

    });
  }

  var getSites = function () {
    $sails.get("/site", function (newSites) {
      if(newSites != null && typeof(newSites) !== "undefined") {
        angular.forEach(newSites, function(site, index){
          newSites[index] = SiteService.getDefaults(site.type, site, newSites.length);
        });
        $rootScope.sites = newSites;
        $rootScope.navigation = getNavigation($rootScope.sites);
        setSiteByRoute();
      } else {
        // TODO redirect
        $log.error ("Can't load Sites");
      }
    });
  }

  var getSitesIfNotSet = function () {
    // get sites only if they are currently not defined
    if($rootScope.sites === null || typeof($rootScope.sites) === "undefined" || typeof($rootScope.sites.length) === "undefined" || $rootScope.sites.length <= 0) {
      getSites();
    }
  }

  var foundSiteByRoute = function (sites, route, cb) {

    if(angular.isUndefined(route)) {
      return cb("route is undefined", null);
    }

    var siteNotFound = true;
    angular.forEach(sites, function(site, index){
      if(siteNotFound) {
        if(site.href == route) {
          siteNotFound = false;
          return cb(null, {site:site, index:index});
        }
      }
    });

    if(siteNotFound) {
      // TODO redirect to custom not found site
      return cb("not found", null);
    }
  }

  var updateSite = function (newSite) {
    foundSiteByRoute($rootScope.sites, newSite.href, function (error, foundSite) {
      angular.extend(foundSite.site, newSite);

      // update current site, if this is the updated site
      var currentSite = SiteService.getCurrentSite();
      if(currentSite.href === foundSite.site.href) {
        angular.extend(currentSite, newSite);
      }
      // $rootScope.sites[foundSite.index] = newSite
      //angular.extend($rootScope.sites[foundSite.index], newSite);
    });
  }

  var getNavigation = function (sites) {
    if(typeof sites !== 'undefined') {
      var result = [];
      for (var i = 0; i < sites.length; i++) {
        if(sites[i] !== null)
          result.push({name: sites[i].name, href: sites[i].href, index: i});
      };
      return result;
    }
    return [];
  }

  $rootScope.$watch('ready', function(newValue, oldValue, scope) {
    if(newValue) {
      // WORKAROUND for Carousel redraw
      WindowService.tigger('resize');
    }
  });

  var init = function () {

    // get sites only if they are currently not defined
    if($rootScope.sites === null || typeof($rootScope.sites) === "undefined" || typeof($rootScope.sites.length) === "undefined" || $rootScope.sites.length <= 0) {
      getSites();
    } else {
      setSiteByRoute();
    }

    // Listen for Comet messages from Sails
    $sails.on('message', function messageReceived(message) {
      if(message.model === "site") {
        if(message.verb === "update") {
          $log.debug("update for site: "+message);
          updateSite(message.data);
          // $rootScope.$apply(function(){
            
          // }); 
          
        }
      }
    });
  }

  init();



});

jumplink.cms.controller('RowController', function($scope, $rootScope, SiteService) {
  $scope.rowIsHeader = function () {
    return angular.isDefined($rootScope.active) && SiteService.getCurrentSite().header && $scope.index === 0;
  }
});

jumplink.cms.controller('ColumnController', function($scope, ContentService, NavbarService) {
  $scope.getID = ContentService.getID;
  $scope.topNavbarIsFixed = NavbarService.topNavbarIsFixed;
  $scope.bottomNavbarIsFixed = NavbarService.bottomNavbarIsFixed;
});

jumplink.cms.controller('CarouselController', function($scope) {
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


jumplink.cms.controller('ColumnButtonController', function($scope, $rootScope, $modal) {

  var buttonModal = $modal({html: true, title: '$scope.modal.title', content: '$scope.modal.content', show: false, template: 'partials/columnModal.jade'});

  // WORKAROUND for this error: https://docs.angularjs.org/error/$sce/itype?p0=html
  buttonModal.$scope.title = $scope.modal.title;
  buttonModal.$scope.content = $scope.modal.content;

  $scope.action = function () {

    if($scope.button.action === "modal") {
      buttonModal.show();
    }

  }
});
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

  $rootScope.selectedLanguage = "en"; // fallback

  // set default language if possible
  $rootScope.$watch('config.languages.default', function (newValues, oldValues) {
    if(typeof newValues !== 'undefined' && newValues.length >= 2) {
      $rootScope.selectedLanguage = newValues;
    }
  });

  $rootScope.$watch('selectedLanguage', function (newValues, oldValues) {
    if(typeof newValues !== 'undefined' && newValues.length >= 2) {
      $translate.uses(newValues).then(function (key) {
        if(angular.isDefined($rootScope.config)) {
          rewriteLanugageList($rootScope.config.languages.active);
        }
        //$log.debug("Sprache zu " + key + " gewechselt.");
      }, function (key) {
        $log.error("Can't switch language");
      });
    }
  });

});

jumplink.cms.controller('BodyController', function($scope, $rootScope, ADMIN, NavbarService) {
  $scope.topNavbarIsFixed = NavbarService.topNavbarIsFixed;
  $scope.bottomNavbarIsFixed = NavbarService.bottomNavbarIsFixed;
});

jumplink.cms.controller('HeadController', function() {

});

jumplink.cms.controller('NavbarController', function() {

});

jumplink.cms.controller('SidebarController', function($rootScope, $scope, ContentService, SiteService) {

  $scope.subcategories = [];

  var isSubcategory = function (row) {
    return angular.isDefined(row.columns) && angular.isArray(row.columns) && angular.isDefined(row.columns[0].header) && row.columns[0].header.active === true && row.columns[0].header.subcategory === true;
  }

  var setSubcategories = function (activeSiteIndex) {
    angular.forEach(SiteService.getCurrentSite().rows, function(row, index){
      if(isSubcategory(row)) {
        // if is top subcategory
        if(row.columns[0].header.size <= 1) {
          $scope.subcategories.push({target: ContentService.getID(row.columns[0].header.content), content: row.columns[0].header.content, children:[]});
        // if is lower subcategory  
        } else if(row.columns[0].header.size >= 2) {
          if($scope.subcategories.length > 0) {
            $scope.subcategories[$scope.subcategories.length - 1].children.push({target: ContentService.getID(row.columns[0].header.content), content: row.columns[0].header.content});
          }
        }
      }
    });
  }

  var resetSubcategories = function (newValues) {
    if(angular.isDefined(newValues) && angular.isDefined(newValues.index)) {
      setSubcategories(newValues.index);
    }
  }

  // TODO same for row.header changes
  $rootScope.$watch('active', function (newValues, oldValues) {
    resetSubcategories(newValues);
  });

});

jumplink.cms.controller('SiteController', function($rootScope, $scope, $sails, $routeParams, $window, $log, SiteService, WindowService, cfpLoadingBar) {

  // If true all rows are rendered
  $rootScope.ready = false;

  $rootScope.renderedRows = 0;

  angular.element($window).bind('resize', function () {
    $log.debug('resize tiggered');
    WindowService.autoPosition();
  });

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

  // WORKAROUND for Carousel redraw
  $rootScope.$watch('ready', function(newValue, oldValue, scope) {
    if(newValue) {
      WindowService.tigger('resize');
    }
  });

  // only run this function when $rootScope.site is set
  var routeChanged = function () {

    //WindowService.smoothScrollPosition(0, false);

    // found active site
    foundSiteByRoute($rootScope.sites, $routeParams.site, function (error, active) {
      
      if(error !== null) {
        $log.error(error);
        // TODO redirect if active site not found
      }
  
      //$rootScope.siteIndex = active.index;
      $rootScope.active = {
        index: active.index,
        name: active.site.name,
        href: active.site.href
      };
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
        routeChanged();
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
    var siteNotFound = true;
    angular.forEach(sites, function(site, index){
      if(siteNotFound) {
        if(site.href == route) {
          siteNotFound = false;
          cb(null, {site:site, index:index});
        }
      }
    });
    // 
    if(siteNotFound ) {
      cb("not found", {site:null, index:sites.length});
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


  
  $scope.smoothScrollPosition = WindowService.smoothScrollPosition

  // get sites only if they are currently not defined
  if($rootScope.sites === null || typeof($rootScope.sites) === "undefined" || typeof($rootScope.sites.length) === "undefined" || $rootScope.sites.length <= 0) {
    getSites();
  } else {
    // otherwise just update the active site
    routeChanged();
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

  angular.element($window).bind('resize', function () {
    $log.debug('resize tiggered');
  });


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
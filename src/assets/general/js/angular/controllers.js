jumplink.cms.controller('LanguageController', function ($scope, $rootScope, $translate) {

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
        //console.log("Sprache zu " + key + " gewechselt.");
      }, function (key) {
        console.log("Can't switch language");
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

jumplink.cms.controller('SidebarController', function($rootScope, $scope, $location, $anchorScroll, $window, ContentService) {

  // TODO do not reload the site complete: https://stackoverflow.com/questions/15472655/how-to-stop-angular-to-reload-when-address-changes
  $scope.gotoAanchor = function (position, event){
    // set the location.hash to the id of
    // the element you wish to scroll to.
    $location.hash(position);
 
    // call $anchorScroll()
    $anchorScroll();
    //console.log($window.pageYOffset);
  };


  $scope.subcategories = [];

  var isSubcategory = function (row) {
    var result = angular.isDefined(row.columns) && angular.isArray(row.columns) && angular.isDefined(row.columns[0].header) && row.columns[0].header.active === true && row.columns[0].header.subcategory === true;
    console.log(result);
    return result;
  }

  var setSubcategories = function (activeSiteIndex) {
    angular.forEach($rootScope.sites[$rootScope.active.index].rows, function(row, index){
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

    console.log($scope.subcategories);
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

jumplink.cms.controller('SiteController', function($rootScope, $scope, $sails, $routeParams, $timeout, SiteService) {

  $rootScope.renderedRows = 0;

  // True if all rows are rendered
  $scope.ready = function () {
    return angular.isDefined($rootScope.sites) && angular.isDefined($rootScope.active) && $rootScope.renderedRows >= $rootScope.sites[$rootScope.active.index].rows.length;
  }

  $scope.sidebarActive = function () {
    return $scope.ready() && $rootScope.sites[$rootScope.active.index].sidebar;
  }

  // only run this function when $rootScope.site is set
  var routeChanged = function () {
    // found active site
    foundSiteByRoute($rootScope.sites, $routeParams.site, function (error, active) {
      
      if(error !== null) {
        console.log(error);
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
        console.log ("Can't load Sites");
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
      if($rootScope.sites[$rootScope.active.index].href === foundSite.site.href) {
        angular.extend($rootScope.sites[$rootScope.active.index], newSite);
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
        console.log("update for site: "+message);
        updateSite(message.data);
        // $rootScope.$apply(function(){
          
        // }); 
        
      }
    }

  });


});

jumplink.cms.controller('RowController', function($scope, $rootScope) {
  $scope.rowIsHeader = function () {
    return angular.isDefined($rootScope.active) && $rootScope.sites[$rootScope.active.index].header && $scope.index === 0;
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
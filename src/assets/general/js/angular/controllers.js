
jumplink.cms.controller('LanguageController', function ($scope, $rootScope, $translate) {
  var rewriteLanugageList = function (newValues) {
    $scope.languages = [];
    angular.forEach(newValues, function(lang, index){
      $scope.languages.push({value: lang, label: $translate('LANGCODE_'+lang.toUpperCase())});
      //- WORKAROUND, please uncommit when bug is fixed: WORKAROUND, see https://github.com/mgcrea/angular-strap/issues/378
      // $scope.languages.push({value: lang, label: '<i class="flag f16 '+lang+'"></i> '+$translate('LANGCODE_'+lang.toUpperCase())});
    });
  }

  // TODO watch for translation changes?
  $rootScope.$watchCollection('config.languages.active', function(newValues, oldValues) {
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

jumplink.cms.controller('HeadController', function($scope) {

});

jumplink.cms.controller('NavbarController', function($scope) {


});

jumplink.cms.controller('SiteController', function($rootScope, $scope, $sails, $routeParams, SiteService, config, $socket) {

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
          // TODO CHECK
          // newSites[index] = angular.copy(SiteService.getDefaults(site.type, site, newSites.length));
          // newSites[index] = angular.extend(SiteService.getDefaults(site.type, site, newSites.length));
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
  $socket.on('message', function messageReceived(message) {

    if(message.model === "site") {
      if(message.verb === "update") {
        console.log("update for site: "+message);
        $rootScope.$apply(function(){
          updateSite(message.data);
        }); 
        
      }
    }

  });

});

jumplink.cms.controller('RowController', function() {
  //console.log($scope.index);
  
});

jumplink.cms.controller('ColumnController', function() {


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
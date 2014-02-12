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
        console.log("Sprache zu " + key + " gewechselt.");
      }, function (key) {
        console.log("Irgendwas lief schief.");
      });
    }
  });

});

jumplink.cms.controller('HeadController', function($scope) {

});

jumplink.cms.controller('NavbarController', function($scope) {


});

jumplink.cms.controller('SiteController', function($rootScope, $scope, $sails, $routeParams, SiteService, config) {

  // only run this function when $rootScope.site is set
  var routeChanged = function () {
    var active = getActiveSite($rootScope.sites, $routeParams.site);
    // WORKAROUND angular.copy ?
    $rootScope.site = angular.copy(SiteService.getDefaults('default', active.site, $rootScope.sites.length), $rootScope.site);
    $rootScope.siteIndex = active.index;
    $rootScope.active = getActiveNavigation($rootScope.site);
  }

  var getSites = function () {
    $sails.get("/site", function (response) {
      if(response != null && typeof(response) !== "undefined") {
        $rootScope.sites = response;
        $rootScope.navigation = getNavigation($rootScope.sites);
        routeChanged();
        $rootScope.active = getActiveNavigation($rootScope.site);    
      } else {
        // TODO redirect
        console.log ("Can't load Sites");
      }
    });
  }

  // TODO redirect if active site not found
  var getActiveSite = function (sites, route) {
    if(typeof sites !== 'undefined' && sites.length > 0) {
      for (var i = 0; i < sites.length; i++) {
        if(sites[i] !== null && sites[i].href == route)
          return {site: sites[i], index: i};
      };
    }
    return null;
  }

  var getNavigation = function (sites) {
    if(typeof sites !== 'undefined') {
      var result = [];
      for (var i = 0; i < sites.length; i++) {
        if(sites[i] !== null)
          result.push({name: sites[i].name, href: sites[i].href});
      };
      return result;
    }
    return [];
  }

  var getActiveNavigation = function (site) {
    return getNavigation([site])[0];
  }

  // get sites only if they are currently not defined
  if($rootScope.sites === null || typeof($rootScope.sites) === "undefined" || typeof($rootScope.sites.length) === "undefined" || $rootScope.sites.length <= 0) {
    getSites();
  } else {
    // otherwise just update the active site
    routeChanged();
  }

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
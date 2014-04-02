jumplink.cms.controller('AdminNavbarController', function($scope, $rootScope, $sails, $location, ParagraphService, RowService, ColumnService, SiteService) {

  $scope.save = function () {

    switch($location.url()) {
      case '/translations':

        $sails.put("/translation/", {translations: $scope.translations}, function (response) {
          if(response != null && typeof(response) !== "undefined") {
            console.log (response);
          } else {
            console.log ("Can't save translation");
          }
        });

      break;
      case '/settings':

        $sails.put("/config/", $rootScope.config, function (response) {
          if(response != null && typeof(response) !== "undefined") {
            console.log (response);
          } else {
            console.log ("Can't save translation");
          }
        });

      break;
      default:

        $sails.put("/site/"+$rootScope.sites[$rootScope.active.index].id, $rootScope.sites[$rootScope.active.index], function (response) {
          if(response != null && typeof(response) !== "undefined") {
            console.log (response);
          } else {
            console.log ("Can't save site");
          }
        });

      break;
    }


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

// TODO make select-language directive usable for this
jumplink.cms.controller('TranslationController', function($scope, $rootScope, $sails, $translate) {

  $rootScope.languageToTranslate = $translate.uses() || 'en';

  var getTranslation = function (lang) {
    //console.log(lang);
    $sails.get('/translation?lang='+lang, function (translations) {
      if(translations != null && typeof(translations) !== "undefined") {
        //console.log(translations);
        if(angular.isUndefined($rootScope.translations))
          $rootScope.translations = {};
        $rootScope.translations[lang] = translations;
      } else {
        // TODO redirect
        console.error ("Can't load translation for "+lang);
      }
    });
  }

  var createSelect = function (newValues) {
    $scope.select = [];
    angular.forEach(newValues, function(lang, index){
      console.log();
      $scope.select.push({value: lang, label: $translate('LANGCODE_'+lang.toUpperCase())});
    });
  }

  var getAvailableTranslation = function () {
      if(angular.isDefined($rootScope.config) && angular.isDefined($rootScope.config.languages.available) && $rootScope.config.languages.available !== null) {
        // console.log(available);
        //$scope.available = available;
        createSelect($rootScope.config.languages.available);
      } else {
        // TODO redirect
        console.log ("Can't load available translations for");
      }
  }

  $rootScope.$watch('languageToTranslate', function (newValue, oldValue, $scope) {
    if(angular.isDefined(newValue)) {
      getTranslation(newValue);
    }
  });

  $rootScope.$watchCollection('config.languages.active', function(newValues, oldValues) {
    if(angular.isDefined(newValues)) {
      createSelect(newValues);
    }
  });

  getAvailableTranslation();
  getTranslation($rootScope.languageToTranslate );


});


jumplink.cms.controller('UsersController', function($scope, $rootScope, $sails, $modal) {
  var getUsers = function () {
    //console.log(lang);
    $sails.get('/user', function (users) {
      if(users != null && typeof(users) !== "undefined") {
        //console.log(translations);
        if(angular.isUndefined($rootScope.users))
          $rootScope.users = {};
        $rootScope.users = users;
      } else {
        // TODO redirect
        console.error ("Can't load users");
      }
    });
  }

  

  $scope.showUser = function (user) {
    $scope.user = user;
    console.log(user);
    userModal.show();
  }

  var userModal = $modal({animation: "am-fade-and-scale", placement: "center", scope: $scope, template: 'admin/partials/userModal.jade', show: false});

  getUsers();

});

jumplink.cms.controller('SettingsController', function($scope, $rootScope, $sails) {
  
});
jumplink.cms.directive("jsAdminNavbar", function () {
  return {
    restrict: "E"
    //, replace: true
    , templateUrl: 'admin/partials/navbar.jade'
    , controller: 'AdminNavbarController'
  }
});

jumplink.cms.directive("columnConfigForm", function () {
  return {
    restrict: "E"
    , scope: {
      formColumn: "="
    }
    , templateUrl: 'admin/partials/columnConfigForm.jade'
    , controller: 'ColumnConfigFormController'
  }
});
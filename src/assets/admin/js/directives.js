jumplink.cms.directive("jsAdminNavbar", function () {
  return {
    restrict: "E"
    //, replace: true
    , templateUrl: 'admin/partials/navbar.jade'
    , controller: 'AdminNavbarController'
  }
});
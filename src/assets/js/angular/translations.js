angular.module("gettext").run(['gettextCatalog', function (gettextCatalog) {
    gettextCatalog.setStrings('de', {"Enter E-Mail":"E-Mail angeben","Enter Password":"Passwort angeben","Please sign in":"Bitte melden Sie sich an","Sign in":"Anmelden"});

}]);
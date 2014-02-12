module.exports = {
  translations: function (cb) {
    var languages = require(__dirname+"/../../../tools/country-list/all_languages.json");
    var translations = [];
    // iterate all available country codes
    Object.keys(languages).forEach(function(currentLanguageCode) {
      var currentTranslations = languages[currentLanguageCode];
      var currentTranslationsWithPrefix = {};
      // iterate all available translated country codes of the current country
      Object.keys(currentTranslations).forEach(function(currentLanguageCode) {
        // Add Prefix to use with angular-translate
        currentTranslationsWithPrefix["LANGCODE_"+currentLanguageCode.toUpperCase()] = currentTranslations[currentLanguageCode];
      });
      // push everythink to a new array
      translations.push({
        lang: currentLanguageCode
        , translations: currentTranslationsWithPrefix
      });
    });
    cb(null, translations);
  }

  , config: function (cb) {
    var languages = require(__dirname+"/../../../tools/country-list/all_languages.json");

    var config = {
      languages: {
        available: []
        , active: ['en', 'de']
      }
      , navbar: {}
      , subtext: {}
    }

    config.navbar.inverse = false; // true: navbar-inverse | false: navbar-default
    config.navbar.type = "fixed-top"; // fixed-top | fixed-bottom | static-top | default (default has no own class)
    config.navbar.container = true;

    config.subtext.types = [
      {
        label: 'muted text'
        , value: 'text-muted'
      }
      , {
        label: 'small text'
        , value: 'small'
      }
    ];

    // iterate all available country codes
    Object.keys(languages).forEach(function(currentLanguageCode) {
      config.languages.available.push(currentLanguageCode);
    });

    cb(null, config);

  }
}
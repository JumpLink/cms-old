module.exports = {
  translations: function (cb) {
    var translations = [];

    var pushLanguageCodes = function () {
      var languages = require(__dirname+"/../../../tools/country-list/basic_languages.json");
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
    }

    var mergeObject = function (dest, src, prefix) {
      for(var key in src){
        //console.log(key+": "+src[key]);
        if(typeof prefix === 'undefined' || prefix === null)
          prefix = '';
        dest[key] = src[key]+prefix;
      }
      return dest;
    }

    var pushMenuTranslations = function () {

      var defaultTrans = [
        {
          lang: 'en',
          translations: {
            BRAND_TRANS: 'Translations',
            BRAND_ADMIN: 'Admin',
            BRAND_USERS: 'Users',
            BRAND_SETTINGS: 'Settings',
            NAV_LIVE: 'Live',
            NAV_TRANS: 'Translations',
            NAV_USERS: 'Users',
            NAV_SETTINGS: 'Settings',
            TRANS_CUR: 'Current translation',
            TRANS_TRAN: 'Translation',
            TRANS_KEY: 'Keyword',
            FOOTER_BACK: 'Back to top'
          }
        }, 
        {
          lang: 'de',
          translations: {
            BRAND_TRANS: 'Übersetzungen',
            BRAND_ADMIN: 'Admin',
            BRAND_USERS: 'Benutzer',
            BRAND_SETTINGS: 'Einstellungen',
            NAV_LIVE: 'Live',
            NAV_TRANS: 'Übersetzungen',
            NAV_USERS: 'Benutzer',
            NAV_SETTINGS: 'Einstellungen',
            TRANS_CUR: 'Aktuelle Übersetzung',
            TRANS_TRAN: 'Übersetzung',
            TRANS_KEY: 'Schlüsselwort',
            FOOTER_BACK: 'Zurück nach oben'
          }
        }
      ];

       /*
        * Merge default translations with langcode translations
        */
      for (var i = 0; i < translations.length; i++) {
        var langFound = false;
        for (var k = 0; k < defaultTrans.length; k++) {
          if(defaultTrans[k].lang === translations[i].lang) {
            translations[i].translations = mergeObject(translations[i].translations, defaultTrans[k].translations)
            langFound = true;
          }
        };
       
       /*
        * If translation not found, use the first default language as default for current (ranslations[i])
        */
        if(!langFound) {
          translations[i].translations = mergeObject(translations[i].translations, defaultTrans[0].translations, " [en]");
        }

      };
    }

    pushLanguageCodes();
    pushMenuTranslations();

    cb(null, translations);
  }

  , config: function (cb) {
    var languages = require(__dirname+"/../../../tools/country-list/all_languages.json");

    var config = {
      languages: {
        available: []
        , active: ['en', 'de']
        , default: 'en'
      }
      , navbar: {}
      , subtext: {}
    }

    config.navbar.inverse = false; // true: navbar-inverse | false: navbar-default
    config.navbar.type = "fixed-top"; // fixed-top | fixed-bottom | static-top | default (default has no own class)
    config.navbar.container = true;

    config.navbar.brand = {
      type: "image" // image | svg | text
      , text: "Title"
      , image: {
        src: "/images/upload/brand.png"
      }
    }

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

  , users: function (cb) {
    cb(null, {email:"admin@admin.org", name: "admin", color: "#000000", password: "cms-admin"});
  }
}
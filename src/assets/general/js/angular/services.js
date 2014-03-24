jumplink.cms.service("NavbarService", function($rootScope, ADMIN) {

  var topNavbarIsFixed = function () {
    return angular.isDefined($rootScope.config) &&  angular.isDefined($rootScope.config.navbar) && $rootScope.config.navbar.type == 'fixed-top'
  }

  var bottomNavbarIsFixed = function () {
    return topNavbarIsFixed() && ADMIN
  }

  return {
    topNavbarIsFixed: topNavbarIsFixed
    , bottomNavbarIsFixed: bottomNavbarIsFixed
  }
});

var ConfigService = jumplink.cms.service("ConfigService", function($rootScope, $sails, $http) {

  var getConfig = function() {
    $sails.get("/config", function (response) {
      if(angular.isDefined(response) && response !== null) {
        return response[0];
      } else {
        console.log ("Can't load Config");
      }
    });
  }

  var setConfigHttp = function() {
    $http({ method: 'GET', url: '/config' }).success(function(data, status, headers, config) {
      if(angular.isDefined(data) && data !== null && status === 200) {
        $rootScope.config = data[0];
      } else {
        console.log ("Can't load Config, status: "+status);
      }
    });
  }

  return {
    getConfig: getConfig
    , setConfigHttp: setConfigHttp
  }

});



jumplink.cms.service("ContentService", function(LoremService, $rootScope) {
  
  var getContent = function (content) {
    return content.langs[$translate.uses()];
  }

  var getDefaults = function (type, replace, placeholder) {
    var defaults = {
      type: type
      , langs: {}
    };

    // replace defaults if set
    if(replace !== null && angular.isDefined(replace)) {
      if(angular.isDefined(replace.type))
        defaults.type = replace.type;

      if(angular.isDefined(replace.langs)) {
        angular.forEach(replace.langs, function(text, langCode) {
          defaults.langs[langCode] = text;
        });
      }
    }

    if(placeholder === null || angular.isUndefined(placeholder))
      placeholder = LoremService.generator({count: 3});

    angular.forEach($rootScope.config.languages.active, function(langCode, index) {
      if(angular.isUndefined(defaults.langs[langCode])) {
        defaults.langs[langCode] = placeholder;
      }
    });

    return defaults;
  };

  var getEnglish = function (content) {
    var result = '';
    if(angular.isDefined(content.langs['en'])) {
      result = content.langs['en'];
    } else { // fallback
      var found = false;
      angular.forEach(replace.langs, function(text, langCode) {
        if(!found)
          result = langCode;
      });
    }
    return result;
  }

  var cleanString = function (string) {
    return string.replace(/[^a-zA-Z0-9]/g,'_').toLowerCase();
  }

  var getID = function (content) {
    return cleanString(getEnglish(content));
  }

  return {
    getDefaults: getDefaults
    , getContent: getContent
    , getEnglish: getEnglish
    , cleanString: cleanString
    , getID: getID
  }
});

jumplink.cms.service("ParagraphService", function(ContentService) {
  var getDefaults = function (type, replace) {
    // global defaults
    var defaults = {
      lead: false                                     // true | false
      , aligned: 'default'                            // (Alignment classes) default | left | center | right
      , color: 'default'                              // (Emphasis classes) text-default | text-muted | text-primary | text-success | text-info | text-warning | text-danger
      , content : null
      , active: true
    }

    // defaults for types
    switch (type) {
      case 'featurette':
        defaults.lead = true;
      break;
      case 'jumbotron':
        defaults.lead = true;
      break;
      case 'marketing':
        defaults.aligned = 'center';
      break;
      case 'marketing-featurette':
        defaults.aligned = 'center';
        defaults.lead = true;
      break;
      case 'default':
      break;
    }

    // replace defaults if set
    if(replace !== null && angular.isDefined(replace)) {
      if(angular.isDefined(replace.aligned))
        defaults.aligned = replace.aligned;

      if(angular.isDefined(replace.color))
        defaults.color = replace.color;

      if(angular.isDefined(replace.content))
        defaults.content = ContentService.getDefaults(type, replace.content);

      if(angular.isDefined(replace.active))
        defaults.active = replace.active;
    }

    if(defaults.content === null)
      defaults.content = ContentService.getDefaults(type, null);


    return defaults;
  }

  return {
    getDefaults: getDefaults
  }
});

jumplink.cms.service("ButtonService", function(LoremService, ContentService) {
  var getDefaults = function (type, replace) {
    var defaults = {
      type: "default"                                                 // 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'link'
      , content: null
      , size: 'default'                                               // 'default' | 'large' | 'small' | 'extra small'
      , href: "#"
      , active: false
    }

    var placeholder = LoremService.generator({units: 'words', count: 2});

    switch (type) {
      case 'featurette':
      break;
      case 'jumbotron':
      break;
      case 'marketing':
      break;
      case 'marketing-featurette':
      break;
      case 'default':
      default:
      break;
    }

    // Set defaults if unset
    if(replace !== null && angular.isDefined(replace)) {

      if(angular.isDefined(replace.type))
        defaults.type = replace.type;

      if(angular.isDefined(replace.content))
        defaults.content = ContentService.getDefaults(type, replace.content, placeholder);

      if(angular.isDefined(replace.size))
        defaults.size = replace.size;

      if(angular.isDefined(replace.href))
        defaults.href = replace.href;

      if(angular.isDefined(replace.active))
        defaults.active = replace.active;
    }

    if(defaults.content === null)
      defaults.active = ContentService.getDefaults(type, null, placeholder);

    return defaults;
  }

  return {
    getDefaults: getDefaults
  }
});

jumplink.cms.service("ImageService", function(LoremService) {
  var getDefaults = function (type, replace) {
    var defaults = {
      position: "top",        // 'top' | 'bottom' | 'left' | 'right' | 'flip'
      type: "default",        // 'default' | 'circle'
      src: "140x140.png",
      width: 140,
      height: 140,
      active: false
    }

    switch (type) {
      case 'featurette':
        defaults.position = 'flip';
      break;
      case 'jumbotron':
        defaults.position = 'left';
      break;
      case 'marketing':
        defaults.type = 'circle';
      break;
      case 'marketing-featurette':
        defaults.width = 500;
        defaults.height = 500;
        defaults.src = "500x500.png";
        defaults.position = 'left';
      break;
      case 'default':
      default:

      break;
    }

    // Set defaults if unset
    if(replace !== null && angular.isDefined(replace)) {
      if(angular.isDefined(replace.position))
        defaults.position = replace.position;

      if(angular.isDefined(replace.type))
        defaults.type = replace.type;

      if(angular.isDefined(replace.src))
        defaults.src = replace.src;

      if(angular.isDefined(replace.width))
        defaults.width = replace.width;

      if(angular.isDefined(replace.height))
        defaults.height = replace.height;

      if(angular.isDefined(replace.active))
        defaults.active = replace.active;
    }

    return defaults;
  }

  return {
    getDefaults: getDefaults
  }
});


jumplink.cms.service("HeaderService", function(LoremService, ContentService) {
  var getDefaults = function (type, replace) {
    var defaults = {
      content: null
      , size: 2
      , active: true
      , subcategory: false // for angular-strap's scrollspy, size is depth in sidebar
    }

    var placeholder = LoremService.generator({units: 'words', count: 2})

    switch (type) {
      case 'featurette':
        defaults.size = 1;
      break;
      case 'jumbotron':
        defaults.size = 1;
      break;
      case 'marketing':

      break;
      case 'marketing-featurette':
        defaults.size = 1;
      break;
      case 'default':

      break;
    }

    // Set defaults if unset
    if(replace !== null && angular.isDefined(replace)) {
      if(angular.isDefined(replace.content))
         defaults.content = ContentService.getDefaults(type, replace.content, placeholder);

      if(angular.isDefined(replace.size))
        defaults.size = replace.size;

      if(angular.isDefined(replace.active))
        defaults.active = replace.active;

      if(angular.isDefined(replace.subcategory))
        defaults.subcategory = replace.subcategory;
    }

    if(defaults.content === null)
      defaults.content = ContentService.getDefaults(type, null, placeholder);

    return defaults;
  }

  return {
    getDefaults: getDefaults
  }
});

jumplink.cms.service("SubtextService", function(LoremService, ContentService) {
  var getDefaults = function (type, replace) {
    var defaults = {
      content: null
      , type: 'small'                                                 // 'small' | 'muted'
      , active: false
    }

    var placeholder = LoremService.generator({units: 'words', count: 2});

    switch (type) {
      case 'featurette':

      break;
      case 'jumbotron':

      break;
      case 'marketing':

      break;
      case 'marketing-featurette':

      break;
      case 'default':

      break;
    }

    // Set defaults if unset
    if(replace !== null && angular.isDefined(replace)) {
      if(angular.isDefined(replace.type))
        defaults.type = replace.type;

      if(angular.isDefined(replace.active))
        defaults.active = replace.active;

      if(angular.isDefined(replace.content))
        defaults.content = ContentService.getDefaults(type, replace.content, placeholder);
    }

    if(defaults.content === null)
      defaults.content = ContentService.getDefaults(type, null, placeholder);

    return defaults;
  }

  return {
    getDefaults: getDefaults
  }
});

jumplink.cms.service("CarouselService", function(SlideService) {
  var getEmpty = function() {
    var empty = {
      type: "default"
      , slides: []
      , height: 500
      , active: false
    }

    return empty;
  }

  var getDefaults = function (type, replace) {

    var defaults = {
      type: type
      , slides: []
      , height: 500
      , active: false
    }

    switch (type) {
      case 'featurette':

      break;
      case 'jumbotron':

      break;
      case 'marketing':

      break;
      case 'marketing-featurette':

      break;
      case 'default':

      break;
    }

    // Set defaults if unset
    if(replace !== null && angular.isDefined(replace)) {
      if(angular.isDefined(replace.type))
        defaults.type = replace.type;

      if(angular.isDefined(replace.height))
        defaults.height = replace.height;

      if(angular.isDefined(replace.slides)) {
        for (var i = 0; i < replace.slides.length; i++) {
          defaults.slides[i] = { row: SlideService.getDefaults(type, replace.slides[i].row) };
          if(angular.isDefined(replace.slides[i].image))
            defaults.slides[i].image = replace.slides[i].image;
          else
            defaults.slides[i].image = { src: 'first_slide.png' };
        };
      }
        //defaults.slides = replace.slides;

      if(angular.isDefined(replace.active))
        defaults.active = replace.active;
    }

    // If slides are not replaced
    if(defaults.slides.length <= 0) {
      defaults.slides.push({
        image: {
          src: 'first_slide.png'
        }
        , row: SlideService.getDefaults(type, null)
      });

      defaults.slides.push({
        image: {
          src: 'second_slide.png'
        }
        , row: SlideService.getDefaults(type, null)
      });

      defaults.slides.push({
        image: {
          src: 'third_slide.png'
        }
        , row: SlideService.getDefaults(type, null)
      });
    }

    return defaults;
  }

  return {
    getDefaults: getDefaults
    , getEmpty: getEmpty
  }
});

jumplink.cms.service("ColumnService", function(ParagraphService, HeaderService, SubtextService, ImageService, CarouselService, ButtonService) {
  var getDefaults = function (type, replace) {
    var defaults = {
      header: {}
      , subtext: {}
      , paragraphs: []
      , image: {}
      , carousel: {}
      , button: {}
      , paragraphs_active: true
      , type: type
    }

    switch (type) {
      case 'featurette':

      break;
      case 'jumbotron':

      break;
      case 'marketing':

      break;
      case 'marketing-featurette':

      break;
      case 'default':

      break;
    }


    // Set defaults if unset
    if(replace !== null && angular.isDefined(replace)) {

      if(angular.isDefined(replace.paragraphs_active))
        defaults.paragraphs_active = replace.paragraphs_active;

      if(angular.isDefined(replace.type))
        defaults.type = replace.type;

      // Set defaults if unset for each paragraph
      if(angular.isDefined(replace.paragraphs) && replace.paragraphs !== null && typeof replace.paragraphs.length !== 'undefined' && replace.paragraphs.length > 0) {
        for (var i = 0; i < replace.paragraphs.length; i++) {
          defaults.paragraphs[i] = ParagraphService.getDefaults(type, replace.paragraphs[i]);
        };
      }

      defaults.header = HeaderService.getDefaults(type, replace.header);

      defaults.subtext = SubtextService.getDefaults(type, replace.subtext);

      defaults.image = ImageService.getDefaults(type, replace.image);

      defaults.carousel = CarouselService.getDefaults(type, replace.carousel);

      defaults.button = ButtonService.getDefaults(type, replace.button);
    } else {

      defaults.header = HeaderService.getDefaults(type, null);

      defaults.subtext = SubtextService.getDefaults(type, null);

      defaults.image = ImageService.getDefaults(type, null);

      defaults.carousel = CarouselService.getDefaults(type, null);

      defaults.button = ButtonService.getDefaults(type, null);

    }

    if(defaults.paragraphs.length === 0)
      defaults.paragraphs.push(ParagraphService.getDefaults(type, null) );



    return defaults;
  }

  return {
    getDefaults: getDefaults
  }
});

// extra service for Row in Carousel to avoid the "Circular Dependency" error
jumplink.cms.service("SlideService", function(HeaderService, SubtextService, ImageService, ButtonService, ParagraphService) {
  var getDefaults = function (type, replace) {

    var defaults = {
      divider: true 
      , type: type
      , columns: []
    }

    var columnLength = 1;

    switch (type) {
      case 'featurette':
      break;
      case 'jumbotron':
      break;
      case 'marketing':
        columnLength = 3;
      break;
      case 'marketing-featurette':
      break;
      case 'default':
      break;
    }

    // Set defaults if unset
    if(replace !== null && angular.isDefined(replace)) {
      if(angular.isDefined(replace.type))
        defaults.type = replace.type;

      if(angular.isDefined(replace.divider))
        defaults.divider = replace.divider;

      if(angular.isDefined(replace.active))
        defaults.active = replace.active;

      if(angular.isDefined(replace.columns)) {
        for (var i = 0; i < replace.columns.length; i++) {
          //defaults.columns[i] = ColumnService.getDefaults(type, replace.columns[i]);
          defaults.columns[i] = {
            header: HeaderService.getDefaults(type, replace.columns[i].header),
            subtext: SubtextService.getDefaults("small", replace.columns[i].subtext),
            image: ImageService.getDefaults(type, replace.columns[i].image),
            button: ButtonService.getDefaults("primary", replace.columns[i].button),
            paragraphs_active: true,
            paragraphs: [],
            carousel: {active: false}
          };

          // Set defaults if unset for each paragraph
          if(angular.isDefined(replace.columns[i].paragraphs) && replace.columns[i].paragraphs !== null && typeof replace.columns[i].paragraphs.length !== 'undefined' && replace.columns[i].paragraphs.length > 0) {
            for (var k = 0; k < replace.columns[i].paragraphs.length; k++) {
              defaults.columns[i].paragraphs[k] = ParagraphService.getDefaults(type, replace.columns[i].paragraphs[k]);
            };
          }

        };
      }
    }

    // If columns are not replaced, insert an example column
    if(defaults.columns.length === 0) {
      // defaults.columns.push(ColumnService.getDefaults(type, null));
      defaults.columns.push({
        header: HeaderService.getDefaults(type, {site: 1}),
        subtext: SubtextService.getDefaults("small", null),
        image: ImageService.getDefaults(type, null),
        button: ButtonService.getDefaults("primary", {active: true, size:'large'}),
        paragraphs_active: true,
        paragraphs: [ParagraphService.getDefaults(type, null)],
        carousel: {active: false}
      });
    }

    return defaults;
  }

  return {
    getDefaults: getDefaults
  }

});

jumplink.cms.service("RowService", function(ColumnService) {
  var getDefaults = function (type, replace) {

    var defaults = {
      divider: true 
      , type: type
      , columns: []
      , style: {}
    }

    var columnLength = 1;

    switch (type) {
      case 'featurette':
      break;
      case 'jumbotron':
      break;
      case 'marketing':
        columnLength = 3;
      break;
      case 'marketing-featurette':
      break;
      case 'default':
      break;
    }

    // Set defaults if unset
    if(replace !== null && angular.isDefined(replace)) {
      if(angular.isDefined(replace.type))
        defaults.type = replace.type;

      if(angular.isDefined(replace.divider))
        defaults.divider = replace.divider;

      if(angular.isDefined(replace.active))
        defaults.active = replace.active;

      if(angular.isDefined(replace.style))
        defaults.style = replace.style;

      for (var i = 0; i < replace.columns.length; i++) {
        defaults.columns[i] = ColumnService.getDefaults(type, replace.columns[i]);
      };
    }

    // If columns are not replaced, insert an example column
    if(defaults.columns.length === 0) {
      for (var i = 0; i < columnLength; i++) {
        defaults.columns.push(ColumnService.getDefaults(type, null));
      };
    }

    return defaults;
  }

  return {
    getDefaults: getDefaults
  }

});

jumplink.cms.service("SiteService", function(RowService, $rootScope, $window, $timeout) {
  var getDefaults = function (type, replace, count) {

    var defaults = {
      name: "new site ("+(count+1)+")" 
      , href: "new"+(count+1)
      , type: type
      , rows: new Array()
      , sidebar: true
      , container: true
      , id : count+1
      , header: true
    }

    var rowLength = 3;

    switch (type) {
      case 'featurette':
      break;
      case 'jumbotron':
      break;
      case 'marketing':
      break;
      case 'marketing-featurette':
      break;
      case 'default':
      break;
    }

    // Set defaults if unset
    if(angular.isDefined(replace) && replace !== null) {
      if(angular.isDefined(replace.type) && replace.type !== null)
        defaults.type = replace.type;

      if(angular.isDefined(replace.name) && replace.name !== null)
        defaults.name = replace.name;

      if(angular.isDefined(replace.href) && replace.href !== null)
        defaults.href = replace.href;

      if(angular.isDefined(replace.sidebar) && replace.sidebar !== null)
        defaults.sidebar = replace.sidebar;

      if(angular.isDefined(replace.container) && replace.container !== null)
        defaults.container = replace.container;

      if(angular.isDefined(replace.id) && replace.id !== null)
        defaults.id = replace.id;

      if(angular.isDefined(replace.header) && replace.header !== null)
        defaults.header = replace.header;

      for (var i = 0; i < replace.rows.length; i++) {
        // angular.copy only as WORKAROUND?
        // defaults.rows[i] = angular.copy(RowService.getDefaults(type, replace.rows[i]), defaults.rows[i]);
        defaults.rows[i] = RowService.getDefaults(type, replace.rows[i]);
      };
    }

    // If rows are not replaced, insert 3 example rows
    if(defaults.rows.length <= 0) {
      for (var i = 0; i < rowLength; i++) {
        defaults.rows.push(RowService.getDefaults(type, null));
      };
    }

    return defaults;
  }

  var checkReady = function () {
    return angular.isDefined($rootScope.sites) && angular.isDefined($rootScope.active) && $rootScope.renderedRows >= $rootScope.sites[$rootScope.active.index].rows.length;
  }

  $rootScope.ready = false;

  angular.element($window).bind('resize', function () {
    console.log('resize tiggered');
  });

  var tigger = function (event) {
    $timeout(function() {
      // anything you want can go here and will safely be run on the next digest.
      angular.element($window).triggerHandler(event);
    })
  }

  $rootScope.$watch('ready', function(newValue, oldValue, scope) {
    if(newValue) {
      tigger('resize');
    }
  });

  $rootScope.$watch('renderedRows', function (newValue, oldValue) {
    $rootScope.ready = checkReady();
  });

  return {
    getDefaults: getDefaults
    , checkReady: checkReady
    , tigger: tigger
  }

});

jumplink.cms.service("PolicyService", function(ADMIN) {
  return {
    // TODO
    changeContentAllowed: function() {
      return ADMIN;
    }
    // TODO
    , translateAllowed: function() {
      return ADMIN;
    }
  }
});

jumplink.cms.service("LoremService", function() {
  // fork of https://github.com/knicklabs/lorem-ipsum.js
  var dictionary = {
    words: [
      'ad',
      'adipisicing',
      'aliqua',
      'aliquip',
      'amet',
      'anim',
      'aute',
      'cillum',
      'commodo',
      'consectetur',
      'consequat',
      'culpa',
      'cupidatat',
      'deserunt',
      'do',
      'dolor',
      'dolore',
      'duis',
      'ea',
      'eiusmod',
      'elit',
      'enim',
      'esse',
      'est',
      'et',
      'eu',
      'ex',
      'excepteur',
      'exercitation',
      'fugiat',
      'id',
      'in',
      'incididunt',
      'ipsum',
      'irure',
      'labore',
      'laboris',
      'laborum',
      'Lorem',
      'magna',
      'minim',
      'mollit',
      'nisi',
      'non',
      'nostrud',
      'nulla',
      'occaecat',
      'officia',
      'pariatur',
      'proident',
      'qui',
      'quis',
      'reprehenderit',
      'sint',
      'sit',
      'sunt',
      'tempor',
      'ullamco',
      'ut',
      'velit',
      'veniam',
      'voluptate'  
    ]
  };

  var generator = function() {
    var options = (arguments.length) ? arguments[0] : {}
      , count = options.count || 1
      , units = options.units || 'sentences'
      , sentenceLowerBound = options.sentenceLowerBound || 5
      , sentenceUpperBound = options.sentenceUpperBound || 15
            , paragraphLowerBound = options.paragraphLowerBound || 3
            , paragraphUpperBound = options.paragraphUpperBound || 7
            , format = options.format || 'plain'
      , words = options.words || dictionary.words
      , random = options.random || Math.random;

    units = simplePluralize(units.toLowerCase());

    var randomInteger = function(min, max) {
      return Math.floor(random() * (max - min + 1) + min);
    };
    
    var randomWord = function(words) {
      return words[randomInteger(0, words.length - 1)];
    };
    
    var randomSentence = function(words, lowerBound, upperBound) {
      var sentence = ''
        , bounds = {min: 0, max: randomInteger(lowerBound, upperBound)};
      
      while (bounds.min < bounds.max) {
        sentence = sentence + ' ' + randomWord(words);
        bounds.min = bounds.min + 1;
      }
      
      if (sentence.length) {
        sentence = sentence.slice(1);
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      }
    
      return sentence;
    };

    var randomParagraph = function(words, lowerBound, upperBound, sentenceLowerBound, sentenceUpperBound) {
      var paragraph = ''
        , bounds = {min: 0, max: randomInteger(lowerBound, upperBound)};
        
      while (bounds.min < bounds.max) {
        paragraph = paragraph + '. ' + randomSentence(words, sentenceLowerBound, sentenceUpperBound);
        bounds.min = bounds.min + 1;
      }
      
      if (paragraph.length) {
        paragraph = paragraph.slice(2);
        paragraph = paragraph + '.';
      }
      
      return paragraph;
    }
    
    var iter = 0
      , bounds = {min: 0, max: count}
      , string = ''
      , prefix = ''
      , suffix = "\r\n";

    if (format == 'html') {
      prefix = '<p>';
      suffix = '</p>';
    }
        
    while (bounds.min < bounds.max) {
      switch (units.toLowerCase()) {
        case 'words':
          string = string + ' ' + randomWord(words);
          break;
        case 'sentences':
          string = string + '. ' + randomSentence(words, sentenceLowerBound, sentenceUpperBound);
          break;
        case 'paragraphs':
          string = string + prefix + randomParagraph(words, paragraphLowerBound, paragraphUpperBound, sentenceLowerBound, sentenceUpperBound) + suffix;
          break;
      }
      bounds.min = bounds.min + 1;
    }
      
    if (string.length) {
      var pos = 0;
      
      if (string.indexOf('. ') == 0) {
        pos = 2;
      } else if (string.indexOf('.') == 0 || string.indexOf(' ') == 0) {
        pos = 1;
      }
      
      string = string.slice(pos);
      
      if (units == 'sentences') {
        string = string + '.';
      }
    }  
    
    return string;
  };

  var simplePluralize = function (string) {
    if (string.indexOf('s', string.length - 1) === -1) {
      return string + 's';
    }
    return string;
  }

  return {
    generator: generator
  }
});
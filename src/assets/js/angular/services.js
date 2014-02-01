jumplink.cms.service("ParagraphService", function(LoremService) {
  var getDefaults = function (type, replace) {
    // global defaults
    var defaults = {
      lead: false                                     // true | false
      , aligned: 'default'                            // (Alignment classes) default | left | center | right
      , color: 'default'                              // (Emphasis classes) text-default | text-muted | text-primary | text-success | text-info | text-warning | text-danger
      , content : LoremService.generator({count: 3})
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
    if(replace !== null && typeof replace !== 'undefined') {
      if(typeof replace.aligned !== 'undefined')
        defaults.aligned = replace.aligned;

      if(typeof replace.color !== 'undefined')
        defaults.color = replace.color;

      if(typeof replace.content !== 'undefined')
        defaults.content = replace.content;

      if(typeof replace.active !== 'undefined')
        defaults.active = replace.active;
    }

    return defaults;
  }

  return {
    getDefaults: getDefaults
  }
});

jumplink.cms.service("ButtonService", function(LoremService) {
  var getDefaults = function (type, replace) {
    var defaults = {
      type: "default"                                                 // 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'link'
      , content: LoremService.generator({units: 'words', count: 2})
      , size: 'default'                                               // 'default' | 'large' | 'small' | 'extra small'
      , href: "#"
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
      default:
      break;
    }

    // Set defaults if unset
    if(replace !== null && typeof replace !== 'undefined') {

      if(typeof replace.type !== 'undefined')
        defaults.type = replace.type;

      if(typeof replace.content !== 'undefined')
        defaults.content = replace.content;

      if(typeof replace.size !== 'undefined')
        defaults.size = replace.size;

      if(typeof replace.href !== 'undefined')
        defaults.href = replace.href;

      if(typeof replace.active !== 'undefined')
        defaults.active = replace.active;
    }

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
    if(replace !== null && typeof replace !== 'undefined') {
      if(typeof replace.position !== 'undefined')
        defaults.position = replace.position;

      if(typeof replace.type !== 'undefined')
        defaults.type = replace.type;

      if(typeof replace.src !== 'undefined')
        defaults.src = replace.src;

      if(typeof replace.width !== 'undefined')
        defaults.width = replace.width;

      if(typeof replace.height !== 'undefined')
        defaults.height = replace.height;

      if(typeof replace.active !== 'undefined')
        defaults.active = replace.active;
    }

    return defaults;
  }

  return {
    getDefaults: getDefaults
  }
});


jumplink.cms.service("HeaderService", function(LoremService) {
  var getDefaults = function (type, replace) {
    var defaults = {
      content: LoremService.generator({units: 'words', count: 2})
      , size: 2
      , active: true
    }

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
    if(replace !== null && typeof replace !== 'undefined') {
      if(typeof replace.content !== 'undefined')
        defaults.content = replace.content;

      if(typeof replace.size !== 'undefined')
        defaults.size = replace.size;

      if(typeof replace.active !== 'undefined')
        defaults.active = replace.active;
    }

    return defaults;
  }

  return {
    getDefaults: getDefaults
  }
});

jumplink.cms.service("SubtextService", function(LoremService) {
  var getDefaults = function (type, replace) {
    var defaults = {
      content: LoremService.generator({units: 'words', count: 2})
      , type: 'small'                                                 // 'small' | 'muted'
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
    if(replace !== null && typeof replace !== 'undefined') {
      if(typeof replace.type !== 'undefined')
        defaults.type = replace.type;

      if(typeof replace.active !== 'undefined')
        defaults.active = replace.active;

      if(typeof replace.content !== 'undefined')
        defaults.content = replace.content;
    }

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
      type: "default"
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
    if(replace !== null && typeof replace !== 'undefined') {
      if(typeof replace.type !== 'undefined')
        defaults.type = replace.type;

      if(typeof replace.height !== 'undefined')
        defaults.height = replace.height;

      if(typeof replace.slides !== 'undefined')
        defaults.slides = replace.slides;

      if(typeof replace.active !== 'undefined')
        defaults.active = replace.active;
    }

    // If slides are not replaced
    if(defaults.slides.length === 0) {
      defaults.slides.push({
        image: {
          src: 'third_slide.png'
        }
        , row: SlideService.getDefaults(type, null, false)
      });

      defaults.slides.push({
        image: {
          src: 'second_slide.png'
        }
        , row: SlideService.getDefaults(type, null, false)
      });

      defaults.slides.push({
        image: {
          src: 'third_slide.png'
        }
        , row: SlideService.getDefaults(type, null, false)
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


    // Set defaults if unset for each paragraph
    if(typeof replace.paragraphs !== 'undefined' && replace.paragraphs !== null && typeof replace.paragraphs.length !== 'undefined' && replace.paragraphs.length > 0) {
      for (var i = 0; i < replace.paragraphs.length; i++) {
        defaults.paragraphs[i] = ParagraphService.getDefaults(type, replace.paragraphs[i]);
      };
    } else {
      defaults.paragraphs.push(ParagraphService.getDefaults(type, null) );
    }

    defaults.header = HeaderService.getDefaults(type, replace.header);

    defaults.subtext = SubtextService.getDefaults(type, replace.subtext);

    defaults.image = ImageService.getDefaults(type, replace.image);

    defaults.carousel = CarouselService.getDefaults(type, replace.carousel);

    defaults.button = ButtonService.getDefaults(type, replace.button);

    return defaults;
  }

  return {
    getDefaults: getDefaults
  }
});

// extra service for Row in Carousel to avoid the "Circular Dependency" error
jumplink.cms.service("SlideService", function() {
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
    if(replace !== null && typeof replace !== 'undefined') {
      if(typeof replace.type !== 'undefined')
        defaults.type = replace.type;

      if(typeof replace.divider !== 'undefined')
        defaults.divider = replace.divider;

      if(typeof replace.active !== 'undefined')
        defaults.active = replace.active;

      for (var i = 0; i < replace.columns; i++) {
        defaults.columns[i] = ColumnService.getDefaults(type, replace.columns[i], false);
      };
    }

    // If columns are not replaced, insert an example column
    if(defaults.columns.length === 0) {
      defaults.columns.push({
        "header": {
          "active": true,
          "content": "Example headline.",
          "size": 1
        },
        "paragraphs": [
          {
            "content": "Note: If you're viewing this page via a <code>file://</code> URL, the \"next\" and \"previous\" Glyphicon buttons on the left and right might not load/display properly due to web browser security rules.",
          }
        ],
        "button": {
          "active": true,
          "type": "primary",
          "content": "Sign up today",
          "href": "#",
          "size": "large"
        },
        "subtext": {
          "type": "small",
          "content": "nostrud id"
        }
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
    if(replace !== null && typeof replace !== 'undefined') {
      if(typeof replace.type !== 'undefined')
        defaults.type = replace.type;

      if(typeof replace.divider !== 'undefined')
        defaults.divider = replace.divider;

      if(typeof replace.active !== 'undefined')
        defaults.active = replace.active;
    }

    for (var i = 0; i < replace.columns; i++) {
      defaults.columns[i] = ColumnService.getDefaults(type, replace.columns[i]);
    };

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

jumplink.cms.service("PolicyService", function(ADMIN) {
  return {
    changeContentAllowed: function() {
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
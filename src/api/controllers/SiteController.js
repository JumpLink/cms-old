/**
 * SiteController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  
  example: function (req, res, next) {

    sails.log.debug("get Site example");

    var type
    , result
    , json_result
    , columns
    , rows = []
    , row
    , sites = []
    , site_header
    , header = {}
    , paragraph
    , content
    , image
    , caption
    , slides
    , carousel
    , button;

    /* ========== template 1 ========== */
    type = "jumbotron";

    header = {
      content: "Hello, world!",
      size: 1
    }

    content = "This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique."
    paragraphs = [];
    paragraphs.push({content:content});
        
    button = {
      type: "default",
      content: "Learn more »",
      href: "#"
    }

    columns = [];
    columns.push({
      header: header
      , paragraphs: paragraphs
    });

    rows.push({
      type: type
      , columns:columns
      , divider: true
    });

    /* ========== template 2 ========== */
    type = "default";

    header = {
      content: "Heading",
      size: 2
    }

    content = "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui."
    paragraphs = [];
    paragraphs.push({content:content});
        
    button = {
      type: "default",
      content: "View details »",
      href: "#"
    }

    columns = [];
    for (var i = 0; i < 3; i++) {
      columns.push({
        header: header
        , paragraphs: paragraphs
      });
    };

    rows.push({
      type: type
      , columns:columns
      , divider: true
    });

    /* ========== template 3 ========== */
    type = "marketing";

    // header
    header = {
      content: "Heading",
      size: 2
    }

    // image
    image = {
      position: "top"
      , type: "circle"
      , src: "140x140.png"
      , width: 140
      , height: 140
    }

    // paragraphs
    content = "Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna."
    paragraphs = [];
    paragraphs.push({content:content});
        
    button = {
      type: "default",
      content: "View details »",
      href: "#"
    }

    columns = [];
    for (var i = 0; i < 3; i++) {
      columns.push({
        header: header
        , paragraphs: paragraphs
        , image: image
        , button: button
      });
    };

    rows.push({
      type: type
      , columns:columns
      , divider: true
    });

    /* ========== template 4 and 5 ========== */
    type = "featurette";

    // header
    header = {
      content: "Oh yeah, it's that good.",
      size: 2
    }

    subtext = {
      content : "See for yourself."
      , type: "muted"
    }

    // image
    image = {
      position: "flip" // flip right left
      , type: "default"
      , src: "500x500.png"
      , width: 500
      , height: 500
    }

    // paragraphs
    content = "Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo."
    paragraphs = [];
    paragraphs.push({content:content, type:"lead"});

    columns = [];
    columns.push({
      header: header
      , subtext: subtext
      , paragraphs: paragraphs
      , image: image
    });

    for (var i = 0; i < 2; i++) {
      rows.push({
        type: type
        , columns:columns
        , divider: true
      });
    };

    /* ========== template 6 ========== */
    type = "jumbotron";

    style = {
      "text-align": "center"
      , "background-color": "transparent"
    }

    // header
    header = {
      content: "Marketing stuff!"
      , size: 1
    }

    button = {
      type: "success"
      , content: "Get started today"
      , href: "#"
      , size: "large" // large | default | small | extra small
    }

    // paragraphs
    content = "Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet."
    paragraphs = [];
    paragraphs.push({content:content});

    columns = [];
    columns.push({
      header: header
      , paragraphs: paragraphs
      , button: button
    });

    rows.push({
      type: type
      , columns:columns
      , style: style
      , divider: true
    });

    /* ========== template header ========== */
    slides = [];

    // slide 1
    image = {
      src: 'first_slide.png'
    }

    header = {
      content: "Example headline."
      , size: 1
    }

    paragraphs = [
      {
        content: "Note: If you're viewing this page via a <code>file://</code> URL, the \"next\" and \"previous\" Glyphicon buttons on the left and right might not load/display properly due to web browser security rules."
      }
    ]

    button = {
      type: "primary"
      , content: "Sign up today"
      , href: "#"
      , size: "large" // large | default | small | extra small
    }

    columns = []; // carousel caption
    columns.push({
      header: header
      , paragraphs: paragraphs
      , button: button
    });

    row = {
      type: "marketing"
      , columns: columns
      , divider: false
    }

    slides.push({
      image: image
      , row: row
    });

    // slide 2
    image = {
      src: 'second_slide.png'
    }

    header = {
      content: "Another example headline."
      , size: 1
    }

    paragraphs = [
      {
        content: "Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit."
      }
    ]

    button = {
      type: "primary"
      , content: "Learn more"
      , href: "#"
      , size: "large" // large | default | small | extra small
    }

    columns = []; // carousel caption
    columns.push({
      header: header
      , paragraphs: paragraphs
      , button: button
    });

    row = {
      type: "marketing"
      , columns: columns
      , divider: false
    }

    slides.push({
      image: image
      , row: row
    });

    // slide 3
    image = {
      src: 'third_slide.png'
    }

    header = {
      content: "One more for good measure."
      , size: 1
    }

    paragraphs = [
      {
        content: "Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec id elit non mi porta gravida at eget metus. Nullam id dolor id nibh ultricies vehicula ut id elit."
      }
    ]

    button = {
      type: "primary"
      , content: "Browse gallary"
      , href: "#"
      , size: "large" // large | default | small | extra small
    }

    columns = []; // carousel caption
    columns.push({
      header: header
      , paragraphs: paragraphs
      , button: button
    });

    row = {
      type: "default"
      , columns: columns
      , divider: false
    }

    slides.push({
      image: image
      , row: row
    });

    carousel = {
      type: "default"
      , slides: slides
      , height: 500
    }

    site_header = {
      type: 'carousel'
      , carousel: carousel
    }

    /* ========== extra template with carousel ========== */
    type = "jumbotron";

    style = {
      "text-align": "center"
      , "background-color": "transparent"
    }

    // header
    header = {
      content: "Carousel in row!"
      , size: 1
    }

    // paragraphs
    content = "Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet."
    paragraphs = [];
    paragraphs.push({content:content});

    columns = [];
    columns.push({
      header: header
      , paragraphs: paragraphs
      , carousel: carousel
    });

    rows.push({
      type: type
      , columns: columns
      , style: style
      , divider: true
    });

    /* ========== template result ========== */
    sites.push({name: "Examples", rows:rows, header:site_header, type:"default"});

    result = {sites:sites};

    res.json(result);
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SiteController)
   */
  _config: {}

  
};

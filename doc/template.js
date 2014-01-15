var util = require('util')
, fs = require('fs')
, type
, result
, json_result
, columns
, roms = []
, sites = []
, header
, paragraph
, content
, image
, button;

/* ========== template 1 ========== */
type = "jumbotron";

header = {
  content: "Hello, world!",
  size: 1
}

content = "This is a template for a simple marketing or informational website. It includes a large callout called a jumbotron and three supporting pieces of content. Use it as a starting point to create something more unique."
paragraphs = [];
paragraphs.push(content);
    
button = {
  type: "default",
  content: "Learn more »",
  href: "#"
}

columns = [];
columns.push({
  type: type
  , header: header
  , paragraphs: paragraphs
});

roms.push({columns:columns});

/* ========== template 2 ========== */
type = "normal";

header = {
  content: "Heading",
  size: 2
}

content = "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui."
paragraphs = [];
paragraphs.push(content);
    
button = {
  type: "default",
  content: "View details »",
  href: "#"
}

columns = [];
for (var i = 0; i < 3; i++) {
  columns.push({
    type: type
    , header: header
    , paragraphs: paragraphs
  });
};

roms.push({columns:columns});

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
}

// paragraphs
content = "Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna."
paragraphs = [];
paragraphs.push(content);
    
button = {
  type: "default",
  content: "View details »",
  href: "#"
}

columns = [];
for (var i = 0; i < 3; i++) {
  columns.push({
    type: type
    , header: header
    , paragraphs: paragraphs
    , image: image
    , button: button
  });
};

roms.push({columns:columns});

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
  , type: "normal"
  , src: "500x500.png"
}

// paragraphs
content = "Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo."
paragraphs = [];
paragraphs.push(content);

columns = [];
columns.push({
  type: type
  , header: header
  , paragraphs: paragraphs
  , image: image
});

for (var i = 0; i < 2; i++) {
  roms.push({columns:columns});
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
  , size: 2
}

button = {
  type: "success"
  , content: "Get started today"
  , href: "#"
}

// paragraphs
content = "Cras justo odio, dapibus ac facilisis in, egestas eget quam. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet."
paragraphs = [];
paragraphs.push(content);

columns = [];
columns.push({
  type: type
  , style: style
  , header: header
  , paragraphs: paragraphs
  , button: button
});

roms.push({columns:columns});

/* ========== template result ========== */
sites.push({name: "Examples", roms:roms});

result = {sites:sites};
json_result = JSON.stringify(result, null, 2);

console.log(util.inspect(result, showHidden=false, depth=null, colorize=true));

//console.log(json_result);

fs.writeFile("./template.json", json_result, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
}); 
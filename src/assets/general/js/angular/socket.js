
jumplink.cms.factory('$socket', function () {
  // as soon as this file is loaded, connect automatically, 
  var socket = io.connect();
  console.log('Socket connecting to JumpLink CMS...');

  socket.on('connect', function socketConnected() {

    // Listen for Comet messages from Sails
    socket.on('message', function messageReceived(message) {

      ///////////////////////////////////////////////////////////
      // Replace the following with your own custom logic
      // to run when a new message arrives from the Sails.js
      // server.
      ///////////////////////////////////////////////////////////
      console.log('New comet message received :: ', message);
      //////////////////////////////////////////////////////

    });


    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to 
    // the Sails.js server.
    ///////////////////////////////////////////////////////////
    console.log(
        'Socket is now connected and accessible as `$socket` angular service.\n' + 
        'e.g. to send a GET request to Sails, try \n' + 
        '`$sails.get("/", function (response) ' +
        '{ console.console.log(response); })`'
    );
    ///////////////////////////////////////////////////////////


  });

  return socket;

});
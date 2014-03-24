/**
 * SessionController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

var bcrypt = require('bcrypt');

module.exports = {

  create: function(req, res, next) {

    // Check for email and password in params sent via the form, if none
    // redirect the browser back to the sign-in form.
    if (!req.param('email') || !req.param('password')) {
      // return next({err: ["Password doesn't match password confirmation."]});

      var usernamePasswordRequiredError = [{
        name: 'usernamePasswordRequired',
        message: 'You must enter both a username and password.'
      }]

      // Remember that err is the object being passed down (a.k.a. flash.err), whose value is another object with
      // the key of usernamePasswordRequiredError
      // TODO Use json error function instead of json
      return res.json({
        err: usernamePasswordRequiredError
      });
    }

    // Try to find the user by there email address. 
    // findOneByEmail() is a dynamic finder in that it searches the model by a particular attribute.
    // User.findOneByEmail(req.param('email')).done(function(err, user) {
    User.findOneByEmail(req.param('email'), function foundUser(err, user) {
      if (err) return next(err);

      // If no user is found...
      if (!user) {
        var noAccountError = [{
          name: 'noAccount',
          message: 'The email address ' + req.param('email') + ' not found.'
        }]
        return res.json({
          err: noAccountError
        });
      }

      // Compare password from the form params to the encrypted password of the user found.
      bcrypt.compare(req.param('password'), user.password, function(err, valid) {
        if (err) return next(err);

        // If the password from the form doesn't match the password from the database...
        if (!valid) {
          var usernamePasswordMismatchError = [{
            name: 'usernamePasswordMismatch',
            message: 'Invalid username and password combination.'
          }]

          // TODO Use json error function instead of json
          return res.json({
            err: usernamePasswordMismatchError
          });
        }

        // Log user in
        req.session.authenticated = true;
        req.session.User = user;

        delete user.password;
        return res.json({authenticated:true,user:user});

      });
    });
  },

  destroy: function(req, res, next) {
    
    if (typeof(req.params.id) === "undefined")
      var id = req.session.User.id;
    else
      var id = req.params.id;

    User.findOne(id, function foundUser(error, user) {

      // var userId = req.session.User.id;
      if (error) return next(error);
      else if (user) {
        // Wipe out the session (log out)
        //req.session.destroy(); Uncomment to not destroy socket session
        req.session.authenticated = false;
        delete req.session.User;
        res.json({authenticated:false});
      } else {

        // Wipe out the session (log out)
        //req.session.destroy(); Uncomment to not destroy socket session
        req.session.authenticated = false;
        delete req.session.User;
        res.json({authenticated:false});
      }
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

};
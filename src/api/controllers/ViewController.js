/**
 * AdminController
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
    
  admin: function(req, res, next) {
    res.view('admin/index');
  }

  , signin: function(req, res, next) {
    // req.locals not accessible in signin view, but req.locals is
    res.locals.flash = _.clone(req.session.flash);
    res.view('admin/legacy/signin');
    req.session.flash = {};
  }

  , user: function(req, res, next) {
    sails.log.debug('user-agent: ');
    sails.log.debug(req.useragent);
    res.view('user/index');
  }

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AdminController)
   */
  , _config: {}

  
};

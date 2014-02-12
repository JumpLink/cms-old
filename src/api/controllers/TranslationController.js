/**
 * LanguageController
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

  find: function (req, res, next) {
    // sails.log.debug(req);

    var lang = req.query.lang || req.param.lang;

    sails.log.debug(lang);

    Translation.findOne({lang:lang}, function (error, result) {
      // console.log(result);
      res.json(result.translations);
    });
  }
    
  
  , setup: function (req, res, next) {
    SetupService.translations(function(error, result) {

      // Translation.createEach(result, function (error, result) {
      Translation.create(result, function (error, result) {
        res.json(result);
      });

    });
  }

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to LanguageController)
   */
  , _config: {}

  
};

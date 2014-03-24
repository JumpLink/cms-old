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

    // sails.log.debug(lang);

    if(lang != [] && lang != {})
      Translation.findOne({lang:lang}, function (error, result) {
        // sails.log.debug(result);
        if(typeof result !== 'undefined')
          res.json(result.translations);
        else
          res.error("Can't load translations");
      });
    else
      Translation.find({}, function (error, result) {
        // sails.log.debug(result);
        if(typeof result !== 'undefined')
          res.json(result);
        else
          res.error("Can't load translations");
      });
  }

  , update: function (req, res, next) {
    console.log("update");
    // sails.log.debug(req.query);
    // sails.log.debug(req.param);

    sails.log.debug(req);
    
    var data = req.params.all();
    sails.log.debug(data);
  }

  , create: function (req, res, next) {
    console.log("create");
  }

  , available: function (req, res, next) {
    Translation.find({}, function (error, all) {
      var result = [];
      for (var i = 0; i < all.length; i++) {
        result.push(all[i].lang);
      };
      res.json(result);
    });
  }

  // setup preview for tests (setup without creation in database)
  , preview: function (req, res, next) {
    SetupService.translations(function(error, result) {
      res.json(result);
    });
  }
    
  , setup: function (req, res, next) {

    async.waterfall([
      function findAll (callback){
        sails.log.debug("findAll");
        Translation.find({}, callback);
      },
      function removeEach(list, callback){
        sails.log.debug("removeEach");
        async.each(list, function remove (item, callback) {
          sails.log.debug(item);
          Translation.destroy({id: item.id}, function (error, destroyed) {
            sails.log.debug(destroyed);
            callback(error);
          })
        }, callback);
      },
      function getNewSetup (callback){
        sails.log.debug("getNewSetup");
        SetupService.translations(callback);
      },
      function createNewSetup (newValue, callback){
        sails.log.debug("createNewSetup");
        Translation.create(newValue, callback);
      },
    ], function (err, result) {
      sails.log.debug("done");
      if(err)
        res.json(err);
      else
        res.json(result);
    });

  }

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to LanguageController)
   */
  , _config: {}

  
};

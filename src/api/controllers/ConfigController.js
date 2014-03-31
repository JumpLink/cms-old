/**
 * ConfigController
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

  setup: function (req, res, next) {
    
    async.waterfall([
      function findAll (callback){
        sails.log.debug("findAll");
        Config.find({}, callback);
      },
      function removeEach(list, callback){
        sails.log.debug("removeEach");
        async.each(list, function remove (item, callback) {
          sails.log.debug(item);
          Config.destroy({id: item.id}, function (error, destroyed) {
            sails.log.debug(destroyed);
            callback(error);
          })
        }, callback);
      },
      function getNewSetup (callback){
        sails.log.debug("getNewSetup");
        SetupService.config(callback);
      },
      function createNewSetup (newValue, callback){
        sails.log.debug("createNewSetup");
        Config.create(newValue, callback);
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
   * (specific to ConfigController)
   */
  , _config: {}

  
};

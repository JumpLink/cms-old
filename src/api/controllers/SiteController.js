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
    TemplateService.example(function(error, result) {
      Site.createEach(result, function (error, result) {
        if(error)
          next(error);
        else
          res.json(result);
      });
    });
  }

  , replace: function (req, res, next) {

    // Locate and validate id parameter
    var id = req.param('id');
    var data = req.params.all();
    if (!id) {
      return res.badRequest('No id provided.');
    }

    // Otherwise, find and destroy the Site in question
    Site.findOne(id).exec(function found(err, result) {

      // TODO: differentiate between waterline-originated validation errors
      //      and serious underlying issues
      // TODO: Respond with badRequest if an error is encountered, w/ validation info
      if (err) return res.serverError(err);

      if (!result) return res.notFound();

      Site.destroy(id).exec(function destroyed(err) {
        // TODO: differentiate between waterline-originated validation errors
        //      and serious underlying issues
        // TODO: Respond with badRequest if an error is encountered, w/ validation info
        if (err) return res.serverError(err);

        // Create new instance of Site using data from params
        Site.create(data).exec(function created (err, data) {
          
          // TODO: differentiate between waterline-originated validation errors
          //      and serious underlying issues
          // TODO: Respond with badRequest if an error is encountered, w/ validation info
          if (err) return res.serverError(err);

          // If we have the pubsub hook, use the Site class's publish method
          // to notify all subscribers about the created item
          if (sails.hooks.pubsub) {
            Site.publishUpdate(id, data.toJSON());
          }

          // Set status code (HTTP 201: Created)
          res.status(201);
          
          // Send JSONP-friendly response if it's supported
          return res.jsonp(data.toJSON());

          // Otherwise, strictly JSON.
          // return res.json(data.toJSON());
        });
      });
    });
  }

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SiteController)
   */
  , _config: {}

  
};
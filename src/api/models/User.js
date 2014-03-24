/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

var beforeUpdateCreate = function(values, next) {
  if(typeof(values.password) === "undefined") {
    next();
  } else {
    bcrypt.hash(values.password, 10, function(err, hash) {
      if(err) return next(err);
      values.password = hash;
      next();
    });
  }
}

module.exports = {

  schema: true // save only the values defined in attributes in database 

  , attributes: {
    email: {
      type: "email"
      , required: true
      , unique: true
    },
    name: {
      type: "string"
      , required: true
    },
    color: {
      type: "string"
      //, hexColor: true //TODO FIXME 
      , required: false
    },
    password: {
      type: 'string'
      , minLength: 6
      , required: true
      , columnName: 'encrypted_password'
    }
  }

  // Lifecycle Callbacks
  , beforeCreate: beforeUpdateCreate
  , beforeUpdate: beforeUpdateCreate

};

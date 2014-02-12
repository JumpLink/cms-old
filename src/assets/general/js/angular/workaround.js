'use strict';
 
angular
  .module('Decorators', [])
  .config(function($provide){
    /**
     * Change $watchCollection due to bug #2621
     * https://github.com/angular/angular.js/issues/2621
     * remove after official fix
     */
    $provide.decorator('$rootScope', function($delegate, $parse) {
 
      function isWindow(obj) {
        return obj && obj.document && obj.location && obj.alert && obj.setInterval;
      }
 
      function isArrayLike(obj) {
        if (obj == null || isWindow(obj)) {
          return false;
        }
 
        var length = obj.length;
 
        if (obj.nodeType === 1 && length) {
          return true;
        }
 
        return angular.isString(obj) || angular.isArray(obj) || length === 0 ||
          typeof length === 'number' && length > 0 && (length - 1) in obj;
      }
 
      var ScopePrototype = Object.getPrototypeOf($delegate),
        isObject = angular.isObject,
        initWatchVal = angular.noop;
 
      ScopePrototype.$watchCollection = function(obj, listener) {
        var self = this;
        var oldValue;
        var newValue;
        var changeFlipFlop = 0;
        var objGetter = $parse(obj);
        var internalArray = [];
        var internalObject = {};
        var internalLength = 0;
 
        // Holds simple value or reference to internalArray or internalObject.
        // The special initial value is used to ensure that the listener is called
        // when the watch is established and that oldValue = newValue.
        var internalValue = initWatchVal;
 
        function $watchCollectionWatch() {
          var newLength, key, i, changeDetected;
 
          newValue = objGetter(self);
          oldValue = internalValue;
          changeDetected = 0;
 
          if (!isObject(newValue)) {
            if (internalValue !== newValue) {
              internalValue = newValue;
              changeDetected++;
            }
          } else if (isArrayLike(newValue)) {
            newLength = newValue.length;
            if (internalValue !== internalArray) {
              // we are transitioning from something which was not an array into array.
              changeDetected++;
            } else {
              if (internalLength !== newLength) {
                // if lengths do not match we need to trigger change notification
                changeDetected++;
              } else {
                // look for item changes
                for (i = 0; i < newLength; i++) {
                  if (internalValue[i] !== newValue[i]) {
                    changeDetected++;
                    break;
                  }
                }
              }
            }
            if (changeDetected) {
              // copy the items to array cache
              internalValue = internalArray = [];
              internalValue.length = internalLength = newLength;
              for (i = 0; i < newLength; i++) {
                internalValue[i] = newValue[i];
              }
            }
          } else {
            if (internalValue !== internalObject) {
              // we are transitioning from something which was not an object into object
              changeDetected++;
            } else {
              // look for item changes
              newLength = 0;
              for (key in newValue) {
                if (newValue.hasOwnProperty(key)) {
                  newLength++;
                  if (! (internalValue.hasOwnProperty(key) &&
                    internalValue[key] === newValue[key])) {
                    changeDetected++;
                    break;
                  }
                }
              }
              if (internalLength !== newLength) {
                changeDetected++;
              }
            }
            if (changeDetected) {
              // copy the items to object cache
              internalValue = internalObject = {};
              internalLength = 0;
              for (key in newValue) {
                if (newValue.hasOwnProperty(key)) {
                  internalLength++;
                  internalValue[key] = newValue[key];
                }
              }
            }
          }
 
          if (changeDetected) {
            changeFlipFlop = 1 - changeFlipFlop;
            if (oldValue === initWatchVal) {
              oldValue = newValue;
            }
          }
 
          return changeFlipFlop;
        }
 
        function $watchCollectionAction() {
          listener(newValue, oldValue, self);
        }
 
        return this.$watch($watchCollectionWatch, $watchCollectionAction);
      };
 
      return $delegate;
    });
 
  });
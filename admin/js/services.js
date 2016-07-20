angular.module('afnAdminApp.services', []).factory('MimeType', function($resource, $q) {
  var res = $resource('http://devbox.home.semaan.ca:8080/mime_types/:id', {id: '@id'}, {
    update: {
      method: 'PUT'
    }
  });
  res.prototype.model_name = "MimeType";
  res.prototype.model_name_pl = "MimeTypes";

  res.prototype.snake_model_name = "mime_type";
  res.prototype.snake_model_name_pl = "mime_types";

  res.prototype.display_attr = "type_name";

  res.formatObject = function(object) {
    object["__display_attr__"] = object[object.__proto__.display_attr];
    return object;
  };

  var super_query = res.query;
  res.query = function() {
    var defer = $q.defer();
    var reply = []
    super_query.call(this, arguments).$promise.then(function(objects){
      for(var i in objects) {
        objects[i] = res.formatObject(objects[i]);
        reply.push(objects[i]);
      }
      defer.resolve(objects);
    }, function() {defer.reject()});
    reply.$promise = defer.promise;
    return reply;
  }

  var super_get = res.get;
  res.get = function(args) {
    var defer = $q.defer();
    var reply = new res();
    super_get.call(this, args).$promise.then(function(object){
      console.log(object)
      object = res.formatObject(object);
      var promise = reply.$promise;
      res.shallowClearAndCopy(object, reply);
      reply.$promise = promise;
      defer.resolve(object);
    });
    reply.$promise = defer.promise;
    console.log(super_get.call(this, args))
    console.log(reply)
    return reply;
  }
  
  res.shallowClearAndCopy = function(src, dst) {
    dst = dst || {};

    angular.forEach(dst, function(value, key) {
      delete dst[key];
    });

    for (var key in src) {
      if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
        dst[key] = src[key];
      }
    }

    return dst;
  }

  return res;
}).factory('Syntax', function($resource) {
  var res = $resource('http://devbox.home.semaan.ca:8080/syntaxes/:id', {id: '@id'}, {
    update: {
      method: 'PUT'
    }
  });
  res.prototype.model_name = "Syntax";
  res.prototype.model_name_pl = "Syntaxes";

  res.prototype.snake_model_name = "syntax";
  res.prototype.snake_model_name_pl = "syntaxes";

  res.prototype.display_attr = "display_name";
  return res;
}).factory('Extension', function($resource, Syntax, MimeType){
  var res = $resource('http://devbox.home.semaan.ca:8080/extensions/:id', {id: '@id'}, {
    update: {
      method: 'PUT'
    }
  });
  res.prototype.model_name = "Extension";
  res.prototype.model_name_pl = "Extensions";

  res.prototype.snake_model_name = "extension";
  res.prototype.snake_model_name_pl = "extensions";

  res.prototype.display_attr = "name";

  res.prototype.relations = {
    syntax_id : Syntax,
    mime_type_id : MimeType,
  };

  return res;
}).service('$popup',function($window){
    this.showPopup=function(message){
        return $window.confirm(message);
    }
}).service('$flash', function($timeout){
  console.log(this)
  this.flash = [];
  
  this.add = function(type, msg, timeout) {
    var self = this;
    var o = {type:type, msg:msg};
    this.flash.push(o);
    if(timeout) {
      $timeout(function(){self.flash.splice(self.flash.indexOf(o), 1)}, timeout)
    }
  }
});


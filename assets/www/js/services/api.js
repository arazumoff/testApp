angular.module('babytask.services')

.factory('ApiCategory', ['$http', 'API_URL', function($http, API_URL) {
  var promise;
  var myService = {
    async: function() {
      if (!promise) {
        promise = $http.get(API_URL+'categories/').then(function (response) {
          return response.data;
        });
      }
      return promise;
    }
  };
  return myService;
}])

.factory('ApiMenuCategory', ['$http', 'API_URL', function($http, API_URL) {
  var promise;
  var myService = {
    async: function() {
      if (!promise) {
        promise = $http.get(API_URL+'menu-categories/').then(function (response) {
          return response.data;
        });
      }
      return promise;
    }
  };
  return myService;
}])

.factory('ApiNorm', ['$http', 'API_URL', function($http, API_URL){
  var promise;
  return {
    async: function(){
      if (!promise){
        promise = $http.get(API_URL+'category-norms/').then(function (response) {
          return response.data;
        });
      }
      return promise;
    }
  }
}])

.factory('ApiProduct', ['$http', 'API_URL', function($http, API_URL) {
  var promise;
  var myService = {
    async: function() {
      if (!promise) {
        promise = $http.get(API_URL+'products/').then(function (response) {
          return response.data;
        });
      }
      return promise;
    }
  };
  return myService;
}])

.service('User', ['$http', '$cordovaDevice', 'localStorageService', 'STORAGE_CONFIG', 'API_URL',
  function($http, $cordovaDevice, localStorageService, STORAGE_CONFIG, API_URL){
  var service = this;
  var uuid = '';
  var makeId = function() {
    var text = "";
    var possible = "!@#ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 9; i++ )
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  };

  var getUUID = function(){
    try{
      uuid = $cordovaDevice.getUUID()
    }catch (e){
      uuid = makeId();
    }
  };
  service.load = function(){
    var str = localStorageService.get('BabyDate');
    if(str != null) {
      var obj = JSON.parse(str);
      if (obj.birthday != "") {
        obj.birthday = new Date(obj.birthday);
      }
      return obj;
    }else{
      return null;
    }
  },
  service.save = function(user){
    var str = JSON.stringify(user);
    localStorageService.set('BabyDate', str);
  },

  service.checkToken = function(cb){
    if(localStorageService.get(STORAGE_CONFIG.TOKEN) == null) {
      uuid = getUUID();
      $http.get(API_URL+'registration/').then(function(res){
        console.log("API REGISTER ",res);
        localStorageService.set(STORAGE_CONFIG.TOKEN, res.data.token)
        cb();
      });
    }else{
      cb();
    }
  }
  return service;
}])

.factory('AuthInterceptor', ['localStorageService', 'STORAGE_CONFIG', function(localStorageService, STORAGE_CONFIG){
  return {
    request: function(config){
      config.headers = config.headers || {};
      if(localStorageService.get(STORAGE_CONFIG.TOKEN) != null){
        config.headers['Authorization'] = 'Token ' + localStorageService.get(STORAGE_CONFIG.TOKEN)
      }
      return config;
    }
  };
}])

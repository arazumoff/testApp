// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('babytask.directives', []);
angular.module('babytask.services', []);
angular.module('babytask.controllers', []);
angular.module('babytask.config', []);
angular.module('babytask.filters', []);
angular.module('babytask.utils', []);
angular.module('babytask.routes', []);

angular.module('babytask', [
  'ionic',
  'ionMdInput',
  'ionic-datepicker',
  'ionic-timepicker',
  'ion-fab-button',
  'babytask.config',
  'babytask.directives',
  'babytask.controllers',
  'babytask.services',
  'babytask.filters',
  'babytask.utils',
  'babytask.routes',
  'ngCordova',
  'LocalStorageModule',
  'underscore',
  'ionic.closePopup'
])

.constant('API_URL', 'http://babytask.webtm.ru/api/v1/')

.run(function($log, $cordovaDevice, $cordovaSplashscreen, localStorageService, STORAGE_CONFIG,
              DB, DbCategory, DbProduct, DbNorm, DbMenuCategory,
              ApiCategory, ApiProduct, ApiNorm, ApiMenuCategory, User) {
  $log.log('run');
  var checkDB = function(){
    if(localStorageService.get(STORAGE_CONFIG.LAST_LOAD) == null){
      DB.init();
      DB._initTables();
      ApiCategory.async().then(function(d){
        DbCategory.insertMany(d);
      });
      ApiProduct.async().then(function(d){
        DbProduct.insertMany(d);
      });
      ApiNorm.async().then(function(d){
        DbNorm.insertMany(d);
      });
      ApiMenuCategory.async().then(function(d){
        DbMenuCategory.insertMany(d);
      });
      localStorageService.set(STORAGE_CONFIG.LAST_LOAD, true);
    }else{
      // Add support check updates
      DB.init();
    }
  }
  User.checkToken(checkDB);
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
})

.config(function(localStorageServiceProvider, STORAGE_CONFIG){
  localStorageServiceProvider.setPrefix(STORAGE_CONFIG.KEY);
})
.config(function($logProvider){
  $logProvider.debugEnabled(true);
})

.config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

ionic.Platform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    angular.bootstrap(document, ["babytask"]);
});

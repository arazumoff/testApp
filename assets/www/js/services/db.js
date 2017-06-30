angular.module('babytask.services')

.factory('DB', function($q, $log, $cordovaSQLite, DB_CONFIG) {
  var self = this;
  self.db = null;

  self.init = function() {
    console.log('init');
    try{
      console.log('cordova');
      self.db = $cordovaSQLite.openDB({ name: DB_CONFIG.name+".db" }); //device
    }catch(e){
      self.db = window.openDatabase(DB_CONFIG.name+".db", '1', 'my', 1024 * 1024 * 100); // browser
    }
  };

  self._initTables = function(){
    angular.forEach(DB_CONFIG.tables, function(table) {
      var columns = [];
      angular.forEach(table.columns, function(column) {
        columns.push(column.name + ' ' + column.type);
      });
      self.query('DROP TABLE '+table.name);
      var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
      self.query(query);
      $log.log('Table ' + table.name + ' initialized');
    });
  };

  self.query = function(query, bindings) {
    bindings = typeof bindings !== 'undefined' ? bindings : [];
    var deferred = $q.defer();

    console.log(query, bindings);
    self.db.transaction(function(transaction) {
      transaction.executeSql(query, bindings, function(transaction, result) {
        console.log("RESULT", query);
        console.log(JSON.stringify(result));
        deferred.resolve(result);
      }, function(transaction, error) {
        console.log(query, bindings);
        $log.log('ERROR QUERY', error.message);
        deferred.reject(error);
      });
    });
    return deferred.promise;
  };

  self.fetchAll = function(result) {
    var output = [];
    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }
    return output;
  };

  self.fetch = function(result) {
    return result.rows.item(0);
  };
  return self;
});

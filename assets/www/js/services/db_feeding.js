angular.module('babytask.services')

.factory('DbFeeding', function(DB, $q) {
  var self = this;
  var table = 'feeding';

  self.add = function(item){
    return DB.query("INSERT OR IGNORE INTO "+table+" (timer_id, type) VALUES (?, ?)", [
      item.timer,
      item.type
    ]).then(function(result){
      return result;
    });
  };

  self.addMany = function(items){
    var main_defer = $q.defer();
    var chain_main = $q.when();
    angular.forEach(items, function(val, k) {
      chain_main.then(function () {
        var deferred = $q.defer();
        var sql = 'INSERT INTO '+table+' (created, feeding_time, type) VALUES (?,?,?)';
        var data = [moment(val['created']).format("YYYY-MM-DD"), val['feeding_time'], val['type']];
        DB.query(sql, data).then(function (result) {
          return deferred.promise;
        });
        return deferred.promise;
      });
    });
    chain_main.then(function(){
      main_defer.resolve();
    });
    return main_defer.promise;
  };

  self.setTime = function(rowid, start, stop){
    return DB.query("UPDATE "+table+" SET start_time=?, stop_time=? WHERE rowid=?", [start, stop, rowid])
      .then(function(result){
        return result;
      });
  };

  self.setPart = function(rowid, part){
    return DB.query("UPDATE "+table+" SET part=? WHERE rowid=?", [part, rowid])
      .then(function(result){
        return result;
      });
  };

  self.setComplete = function(rowid, is){
    return DB.query("UPDATE "+table+" SET complete=? WHERE rowid=?", [is, rowid])
      .then(function(result){
        return result;
      });
  };

  self.setAmount = function(rowid, amount){
    return DB.query("UPDATE "+table+" SET complete=1, amount=? WHERE rowid=?", [amount, rowid])
      .then(function(result){
        return result;
      });
  }

  self.setDelete = function(rowid){
    return DB.query("UPDATE "+table+" SET deleted=1 WHERE rowid=?", [rowid])
      .then(function(result){
        return result;
      });
  };

  self.setComment = function(rowid, comment){
    return DB.query("UPDATE "+table+" SET comment=? WHERE rowid=?", [comment, rowid])
      .then(function(result){
        return result;
      });
  };

  self.getForDay = function(day){
    return DB.query("SELECT rowid, * FROM "+table+" WHERE strftime('%Y-%m-%d', created)=?", [day])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  //удаляем крмления начиная с даты.
  self.clearFromDate = function(day){
    return DB.query("DELETE FROM "+table+" WHERE timer_id in (SELECT rowid FROM timer WHERE strftime('%Y-%m-%d', timer_date)>?)", [day])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  self.getForDayFromTimers = function(day){
    return DB.query("SELECT f.rowid, f.*, t.timer_time FROM "+table+" f " +
      "INNER JOIN timer t ON f.timer_id=t.rowid WHERE strftime('%Y-%m-%d', t.timer_date)=?", [day])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };
  return self;
})

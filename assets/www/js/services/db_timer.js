angular.module('babytask.services')

.factory('DbTimer',['$q', 'MASTER_CONFIG', 'DB', function($q, MASTER_CONFIG, DB) {
  var self = this;
  var table = 'timer';

  self.all = function () {
    return DB.query('SELECT rowid, * FROM ' + table)
      .then(function (result) {
        return DB.fetchAll(result);
      });
  };

  self.getForDay = function(day){
    return DB.query('SELECT t.rowid, t.* FROM ' + table+ ' t WHERE timer_date = ?', [day])
      .then(function (result) {
        return DB.fetchAll(result);
      });
  };

  self.getOrCreate = function(date, time, flag){
    // добавляем или получаем запись времени приема
    var deferred = $q.defer();
    // получение названия
    console.log(MASTER_CONFIG);
    var names = MASTER_CONFIG.PRODUCT_FEEDING_TIME;

    var name = '';
    if(flag === undefined){
      var row = _.find(names, function(iter){return iter['val'] == time;});
      if(row !== undefined){
        name = row['name'];
      }
    }
    self.getForDayAndTime(date, time).then(function(row){

      if(row.length == 0){
        console.log("TIMER ", row, new Date().getTime());
        self.add({
          created: moment().format('YYYY-MM-DD'),
          date: date,
          time: time,
          name: name
        }).then(function(new_row){
          deferred.resolve(new_row.insertId);
        });
      }else{
        deferred.resolve(row[0]['rowid']);
      }
    });
    return deferred.promise;
  };

  self.update = function(rowid, time, name){
    return DB.query("UPDATE "+table+" SET timer_time=?, name=? WHERE rowid=?", [time, name, rowid])
      .then(function(result){
        return result;
      });
  }

  self.getForDayAndTime = function(date, time){
    return DB.query('SELECT rowid, * FROM ' + table+ ' WHERE timer_time=? AND timer_date=?', [time, date])
      .then(function (result) {
        return DB.fetchAll(result);
      });
  };

  self.add = function(item){
    return DB.query("INSERT OR IGNORE INTO "+table+" (created, timer_date, timer_time, name) VALUES (?, ?, ?, ?)", [
      item.created,
      item.date,
      item.time,
      item.name||"",
    ]).then(function(result){
      return result;
    });
  };

  return self;
}])

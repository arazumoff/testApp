angular.module('babytask.services')

.factory('DbRation', function(DB, $q, _) {
  var self = this;
  var table = 'ration';

  self.add = function(item){
    return DB.query("INSERT OR IGNORE INTO "+table+" (timer_id, amount, product_id, is_new) VALUES (?, ?, ?, ?)", [
      item.timer,
      item.amount,
      item.product_id,
      item.is_new
    ]).then(function(result){
      return result;
    });
  };

  self.addMany = function(items){
    var main_defer = $q.defer();
    var sql = 'INSERT INTO '+table+' (created, product_id, amount, feeding_time) VALUES ';

    var data = [];
    var rowArgs = [];

    var chain_main = $q.when();
    angular.forEach(items, function(val, k) {
      chain_main.then(function () {
        var deferred = $q.defer();
        var child_chain = $q.when();
        angular.forEach(val['items'], function (v, key) {
          child_chain.then(function () {
            var deferred_child = $q.defer();
            var sql = 'INSERT INTO ration (created, product_id, amount, feeding_time) VALUES (?,?,?,?)';
            var data = [moment(k).format("YYYY-MM-DD"), v['rowid'], v['amount'], v['feeding_time']];
            DB.query(sql, data).then(function (result) {
              console.log('ID', v['rowid']);
              return deferred_child.promise;
            });
          });
        });
        child_chain.then(function () {
          deferred.resolve();
        });
        return deferred.promise;
      });
    });
    chain_main.then(function(){
      console.log('GO');
      main_defer.resolve();
    });
    return main_defer.promise;
  }

  self.getForDay = function(day){
    return DB.query("SELECT p.rowid, r.rowid as ration_id, * FROM "+table+" r LEFT JOIN product p ON " +
        "r.product_id=p.rowid WHERE strftime('%Y-%m-%d', created)=?", [day])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  self.getForDayFromTimers = function(day){
    return DB.query('SELECT r.rowid as ration_id, r.*, p.name FROM ration r INNER JOIN product p ON p.rowid =r.product_id' +
      ' INNER JOIN timer t ON r.timer_id = t.rowid  WHERE t.timer_date = ?', [day])
      .then(function (result) {
        return DB.fetchAll(result);
      });
  };

  self.getAllForProduct = function(id){
    return DB.query("SELECT rowid, * FROM "+table+" WHERE product_id=?", [id])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  self.setAmount = function(rowid, amount){
    return DB.query("UPDATE "+table+" SET complete=1, amount=? WHERE rowid=?", [amount, rowid])
      .then(function(result){
        return result;
      });
  };

  self.getMonth = function(start, stop){
    return DB.query("SELECT r.status, r.is_new, t.timer_date FROM "+table+" r INNER JOIN timer t ON r.timer_id = t.rowid " +
      "WHERE t.timer_date BETWEEN '"+start+"' AND '"+stop+"'")
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  self.setComment = function(rowid, comment){
    return DB.query("UPDATE "+table+" SET comment=? WHERE rowid=?", [comment, rowid])
      .then(function(result){
        return result;
      });
  };

  self.changeProduct = function(rowid, to){
    return DB.query("UPDATE "+table+" SET product_id=? WHERE rowid=?", [to, rowid])
      .then(function(result){
        return result;
      });
  };

  self.setStatus = function(rowid, status){
    return DB.query("UPDATE "+table+" SET status=? WHERE rowid=?", [status, rowid])
      .then(function(result){
        return result;
      });
  };

  self.setDelete = function(rowid){
    return DB.query("UPDATE "+table+" SET deleted=1 WHERE rowid=?", [rowid])
      .then(function(result){
        return result;
      });
  };

  self.getForMonth = function(start, stop){
    var sql = "";
    return DB.query(sql, [start, stop])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  //удаляем продукты начиная с даты.
  self.clearFromDate = function(day){
    return DB.query("DELETE FROM "+table+" WHERE timer_id in (SELECT rowid FROM timer WHERE strftime('%Y-%m-%d', timer_date)>?)", [day])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  // получаем список продуктов на период + массу
  self.getShopping = function(start, stop){
    var sql = "SELECT p.rowid, p.name, sum(r.amount) as value, 0 as complete FROM ration r " +
      "INNER JOIN timer t ON t.rowid=r.timer_id " +
      "INNER JOIN product p ON r.product_id=p.rowid " +
      "WHERE strftime('%Y-%m-%d', t.timer_date)=? GROUP BY r.product_id";

    var vars = [start];
    if (stop != undefined){
      sql = "SELECT p.rowid, p.name, sum(r.amount) as value, 0 as complete FROM ration r " +
        "INNER JOIN timer t ON t.rowid=r.timer_id " +
        "INNER JOIN product p ON r.product_id=p.rowid " +
        "WHERE strftime('%Y-%m-%d', t.timer_date) >= ? AND strftime('%Y-%m-%d', t.timer_date) <= ? GROUP BY r.product_id";
      vars = [start, stop];
    }
    return DB.query(sql, vars)
      .then(function(result){
        return DB.fetchAll(result);
      });
  };
  return self;
})

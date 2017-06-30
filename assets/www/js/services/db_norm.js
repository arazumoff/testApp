angular.module('babytask.services')

.factory('DbNorm', function(DB) {
  var self = this;
  var table = 'norms';

  self.all = function() {
    return DB.query('SELECT * FROM '+table)
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  self.insertMany = function(items){
    angular.forEach(items, function(item) {
      self.add(item);
    });
  };

  self.forAgeEnable = function(age){
    return DB
      .query('SELECT rowid, * FROM '+table+' WHERE age=?', [age])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  self.checkCategoryForAge = function(category_menu, age){
    return DB
      .query('SELECT * FROM '+table+' WHERE menu_category=? AND age=?', [category_menu, age])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  self.getNormsForAge = function(age){
    return DB
      .query('SELECT mc.name, * FROM '+table+' n LEFT JOIN menu_category mc ON n.menu_category = mc.rowid WHERE n.age=?', [age])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  self.add = function(item){
    return DB.query("INSERT OR IGNORE INTO "+table+" (ext_id, age, amount, unit, menu_category) VALUES (?, ?, ?, ?, ?)", [
      item.id,
      item.age,
      item.amount,
      item.unit,
      item.menu_category
    ]).then(function(result){
      return result;
    });
  };
  return self;
})

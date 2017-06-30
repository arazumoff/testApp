angular.module('babytask.services')

.factory('DbMenuCategory', function(DB) {
  var self = this;
  var table = 'menu_category';

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

  self.add = function(item){
    return DB.query("INSERT OR IGNORE INTO "+table+" (ext_id, name) VALUES (?, ?)", [
      item.id,
      item.name
    ]).then(function(result){
      return result;
    });
  };

  return self;
});

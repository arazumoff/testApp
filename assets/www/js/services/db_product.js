angular.module('babytask.services')

.factory('DbProduct', function(DB) {
  var self = this;
  var table = 'product';

  self.all = function() {
    return DB.query('SELECT rowid, * FROM '+table)
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  self.insertMany = function(items){
    angular.forEach(items, function(item) {
      self.add(item);
    });
  },

  self.add = function(item){
    return DB.query("INSERT OR IGNORE INTO "+table+" (ext_id, name, description, ext_category, menu_category) VALUES (?, ?, ?, ?, ?)", [
      item.id,
      item.name,
      item.description||"",
      item.category,
      item.menu_category
      ]).then(function(result){
        return result;
    });
  };

  self.getEntered = function(){
    return DB.query('SELECT p.rowid, * FROM '+table+' p INNER JOIN ration r ON p.rowid=r.product_id GROUP BY p.rowid')
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  // получаем продукты со статусу
  self.getProductWithStatus = function(status){
    return DB.query('SELECT p.rowid, * , r.status FROM '+table+' p INNER JOIN ration r ON p.rowid=r.product_id WHERE r.status=?', [status])
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  // получить продукты, которых нет в product_enable
  self.getNotEnable = function(ids){
    return DB.query('SELECT p.rowid, *, "" as feeding_time FROM '+table+' p WHERE rowid NOT IN ('+ids.join(",")+')')
      .then(function(result){
        return DB.fetchAll(result);
      });
  };

  self.getEnable = function(){
    return DB.query('SELECT p.rowid, p.*, * FROM product_enable pe LEFT JOIN product p ON pe.product_id=p.rowid')
      .then(function(result){
        return DB.fetchAll(result);
      });
  }

  //создание нового товара
  self.addNew = function(item, added){
    return DB.query("INSERT OR IGNORE INTO product_enable (product_id, added, feeding_time, date) VALUES (?, ?, ?, ?)", [
      item.rowid,
      added,
      item.feeding_time,
      new Date()
    ]).then(function(result){
      console.log(result);
      return result;
    });
  }

  self.getAllFromCategoryMenu = function(cat_id){
    return DB
      .query('SELECT rowid, * FROM '+table+' WHERE menu_category=?', [cat_id])
      .then(function(result){
        return DB.fetchAll(result);
      });
  }

  self.getAllFromCategory = function(cat_id){
    return DB
      .query('SELECT * FROM '+table+' WHERE ext_category=?', [cat_id])
      .then(function(result){
        return DB.fetchAll(result);
      });
  }

  self.getById = function(id) {
    return DB.query('SELECT rowid, * FROM '+table+' WHERE rowid = ?', [id])
      .then(function(result){

        var lst = DB.fetch(result);
        return lst;
      });
  };
  return self;
});

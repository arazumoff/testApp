angular.module('babytask.services')

  .factory('DbCategory', function(DB) {
    var self = this;
    var table = 'category';

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
    /*
    Add new category
    item - {
      id:int,
      name:string
    }
     */
    self.add = function(item){
      return DB.query("INSERT OR IGNORE INTO "+table+" (ext_id, name) VALUES (?, ?)",[
        item.id, item.name
      ]).then(function(result){
        return result;
      });
    };
    self.update = function(){

    };
    self.getById = function(id) {
      return DB.query('SELECT rowid, * FROM '+table+' WHERE id = ?', [id])
        .then(function(result){
          return DB.fetch(result);
        });
    };
    return self;
  });

angular.module('babytask.config')

.constant('DB_CONFIG', {
  name: 'babytask',
  is_production: false,
  //is_production: true,
  size:2 * 1024 * 1024, //or -1
  tables: [{ // категории продуктов
    name: 'category',
    columns: [
      {name: 'ext_id', type: 'integer unique'},
      {name: 'name', type: 'text'},
    ]
  },{ //  категории меню
    name: 'menu_category',
    columns: [
      {name: 'ext_id', type: 'integer unique'},
      {name: 'name', type: 'text'},
    ]
  }, {
    name: 'product',
    columns: [
      {name: 'ext_id', type: 'integer'},
      {name: 'ext_category', type: 'integer'},
      {name: 'name', type: 'text'},
      {name: 'category', type: 'integer'},
      {name: 'menu_category', type:'integer'},
      {name: 'description', type: 'text'},
    ]
  },{
    name: 'product_enable',
    columns:[
      {name: 'product_id', type:'integer unique'},
      {name: 'added', type: 'integer'},
      {name: 'comment', type: 'text'},
      {name: 'feeding_time', type: 'integer'},
      {name: 'period', type: 'integer'},
      {name: 'date', type: 'text'},
    ]
  },{
    name: 'norms',
    columns:[
      {name: 'ext_id', type: 'integer'},
      {name:'age', type:'integer'},
      {name:'amount', type:'real'},
      {name:'unit', type:'text'},
      {name:'menu_category', type:'integer'},
    ]
  },{
    name: 'timer',
    columns: [
      {name: 'created', type: 'text'},
      {name: 'timer_date', type: 'text'},
      {name: 'timer_time', type: 'text'},
      {name: 'name', type: 'text'},
    ]
  }, { // меню для календаря
    name: 'ration',
    columns: [
      {name: 'created', type: 'text'},
      {name: 'status', type: 'integer'},
      {name: 'timer_id', type: 'integer'},
      {name: 'is_new', type: 'integer'}, // продукт недавно введен
      {name: 'amount', type: 'real'},
      {name: 'feeding_time', type: 'integer'},
      {name: 'deleted', type:'integer'},
      {name: 'replace', type:'integer'},
      {name: 'complete', type:'integer'},
      {name: 'product_id', type: 'integer'},
      {name: 'comment', type: 'text'},
      {name: 'time', type: 'text'},
    ]
  }, { //вскармливание
    name: 'feeding',
    columns: [
      {name: 'created', type: 'text'},
      {name: 'feeding_time', type: 'integer'},
      {name: 'timer_id', type: 'integer'},
      {name: 'start_time', type: 'text'},
      {name: 'stop_time', type: 'text'},
      {name: 'type', type: 'integer'},
      {name: 'deleted', type:'integer'},
      {name: 'complete', type:'integer'},
      {name: 'part', type: 'integer'}, //left or right
      {name: 'amount', type: 'integer'},
      {name: 'comment', type: 'text'},
    ]
  }]
});

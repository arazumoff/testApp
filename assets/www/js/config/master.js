angular.module('babytask.config')

.service('MASTER_CONFIG', ['Utils', function(Utils){
  var master = {
    PRODUCT_FEEDING_TIME: [{
      id: 1,
      name: 'Ранний завтрак',
      val:'08:00',
      //time: Utils.releaseDate(8)
    },{
      id: 2,
      name: 'Завтрак',
      val: '10:00',
      //time: Utils.releaseDate(10)
    },{
      id: 3,
      name: 'Обед',
      val: '13:00',
      //time: Utils.releaseDate(13)
    },{
      id: 4,
      name: 'Полдник',
      val: '16:00',
      //time: Utils.releaseDate(16)
    },{
      id: 5,
      name: 'Ужин',
      val: '19:00',
      //time: Utils.releaseDate(19)
    },{
       id: 6,
       name: 'Завтрак и ужин',
      val: ['10:00', '19:00']
    },{
       id: 7,
       name: 'Завтрак и обед',
      val: ['10:00', '19:00']
     },{
       id: 8,
       name: 'Обед и ужин',
      val: ['13:00', '19:00']
     }, {
       id: 9,
       name: 'Завтрак и полдник',
      val: ['10:00', '16:00']
     },{
       id: 10,
       name: 'Обед и полдник',
      val: ['13:00', '16:00']
     },
    ],
    FEED_TIMES:[{
      feeding_set: 1,
      time: Utils.releaseDate(7),
      val: '07:00',
      is_choose: false
    }, {
      feeding_set: 2,
      time: Utils.releaseDate(10.5),
      val: '10:30',
      is_choose: false
    }, {
      feeding_set: 3,
      time: Utils.releaseDate(14),
      val: '14:00',
      is_choose: false
    }, {
      feeding_set: 4,
      time: Utils.releaseDate(17.5),
      val: '17:30',
      is_choose: false
    }, {
      feeding_set: 5,
      time: Utils.releaseDate(21),
      val: '21:00',
      is_choose: false
    }],
    PERIOD:[{
        name: '3 дня',
        value: 3
      }, {
        name: '4 дня',
        value: 4
      }, {
        name: '5 дней',
        value: 5
      }, {
        name: '6 дней',
        value: 6
      }, {
        name: '7 дней',
        value: 7
      }],
    NORMS_FOR_NEW:[
      {category_id:1, vars:[5,15,30]},
      {category_id:3, vars:[5,10,15]},
      {category_id:4, vars:[5,15,30]},
      {category_id:5, vars:[5,5,10]},
      {category_id:6, vars:[5,15,30]},
      {category_id:8, vars:[10,20,30]},
      {category_id:9, vars:[5,10,20]},
      {category_id:10, vars:[0.1,0.15,0.15]},
      {category_id:12, vars:[20,30,50]},
      {category_id:13, vars:[1,3,3]},
      {category_id:14, vars:[5,10,15]},
    ]
  };
  return master;
}
  ])

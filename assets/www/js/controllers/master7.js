angular.module('babytask.controllers')

.controller('master7Ctrl', function($scope, $q, $ionicLoading, $state, _,
           localStorageService, DbProduct, DbNorm, DbRation, DbFeeding, DbTimer, MASTER_CONFIG){

  $scope.periods = MASTER_CONFIG.PERIOD;
  if($scope.user.count_month <= 5){
    $scope.user.days_for_adding = 7;
  }else if($scope.user.count_month == 6 && $scope.user.count_month == 7){
    $scope.user.days_for_adding = 5;
  }else if($scope.user.count_month == 8 && $scope.user.count_month == 9){
    $scope.user.days_for_adding = 4;
  }else{
    $scope.user.days_for_adding = 3;
  }

  var enable_lst = JSON.parse(localStorageService.get('products_enable'));
  var count = 30; // кол-во дней, на которые вводим меню
  var days = {};
  var types_map = {'A':1, 'B': 2, 'C':3};
  //мапим категорию кормления
  var feeding_type = types_map[$scope.user.feeding_type];
  // период ввода новых продуктов
  var period = $scope.user.days_for_adding;
  // счетчик дней ввода нового продукта
  var count_periods = 0;
  //нормы для новых продуктов
  var normsNew = MASTER_CONFIG.NORMS_FOR_NEW;

  var added_lst = _.filter(enable_lst, function(item){return item['added'] == true;});
  var new_list = _.filter(enable_lst, function(item){return item['added'] == false;});

  //выбрали только отмеченные кормления
  var feeding = [];
  if(localStorageService.get('feeds')){
    var feeding = JSON.parse(localStorageService.get('feeds'));
  }
  // формируем массив времени, когда надо кормить в течении дня
  var times = _.map(enable_lst, function(item){return item['time'];})
  // массив времен кормления
  var times_feed = _.map(feeding, function(item){return item['time'];});
  console.log(times);
  console.log($scope.user.feeding_times);

  function genDays(times){
    for (var i = 0; i < count; i++) {
      var date = moment().add(i, 'days');
      var times_day = {};
      _.each(times, function(item){
        times_day[item] = [];
      });
      days[date.format('YYYY-MM-DD')] = times_day;
    }
  }

  function genMenu(lst){
    var main_deferred = $q.defer();

    $q.when()
    .then(function(){
      var deferred = $q.defer();
      DbNorm.forAgeEnable($scope.user.count_month).then(function(items){
        console.log('NORMS ', items);
        deferred.resolve(items);
      });
      return deferred.promise;
    }).then(function(norms) {
      var tmp = {};
      var keys = _.keys(lst);
      var deferred = $q.defer();

      var groups_already = _.groupBy(added_lst, function (row) {return row.menu_category});
      var groups_new = _.groupBy(new_list, function (row) {return row.menu_category});
      //console.log("NEW already", groups_already);
      //console.log("NEW groups", groups_new);
      var i = 0;
      if (added_lst.length > 0) {
        //обработал уже имеющиеся продукты
        _.each(lst, function (val, date) {
          // перебираем дни меню
          //заполняем уже имеющиеся продукты
          _.each(groups_already, function (group, k) {
            // перебирвем группы
            // есть ключ к нормам
            var amount = '';
            if (k != null) {
              // ищем норму для категории меню
              var norm = _.find(norms, function(iter, iter_k) {return iter.menu_category == k;});
              if (norm != undefined) {
                amount = norm['amount'] / group.length;
              }
            }
            _.each(group, function (g) {
              lst[date][g['time']].push({id: g.id, is_new: false, menu_category: g.menu_category, amount: amount});
            });
          });
          if (i == keys.length - 1) {
            deferred.resolve({'lst': lst, 'norms': norms});
          }
          i++;
        });
      }else{
        deferred.resolve({'lst': lst, 'norms': norms});
      }
      return deferred.promise;
    }).then(function(data) {
      var lst = data['lst'];
      var norms = data['norms'];
      var keys = _.keys(lst);
      var deferred = $q.defer();
      var groups_already = _.groupBy(added_lst, function (row){return row.menu_category});
      var groups_new = _.groupBy(new_list, function (row){return row.menu_category});

      if (new_list.length > 0) {
        // добавляем новые
        var i = 0;
        _.each(lst, function (val, date) {
          if (i % period == 0 && count_periods < 3) {
            //добавляем нормы
            _.each(groups_new, function (group, category_id) {
              var amount_norm = '';
              var amount = '';
              if (category_id != null) {
                var norm = _.find(normsNew, function (r) {
                  return r.category_id == category_id
                });
                amount_norm = norm['vars'][count_periods];

                var count_already = 0;
                _.each(val, function (time_lst, time) {
                  var tmp_l = _.filter(time_lst, function (ic) {
                    return ic['menu_category'] == category_id;
                  });
                  count_already += tmp_l.length;
                });
                // высчитываем нормы для каждого нового продукта в группе
                amount = amount_norm / group.length;

                if (count_already > 0) {
                  var minus = amount / count_already;
                  _.each(val, function (time_lst, time) {
                    _.each(time_lst, function (ic) {
                      if (ic['menu_category'] == category_id) {
                        ic['amount'] -= minus;
                      }
                    });
                  });
                }
                _.each(group, function (g) {
                  lst[date][g['time']].push({
                    id: g.id,
                    is_new: true,
                    menu_category: g.menu_category,
                    amount: amount
                  });
                });
              } else {
                // если нет категории меню, не считаем норму, просто добавляем
                _.each(group, function (g) {
                  lst[date][g['time']].push({id: g.id, is_new: true, menu_category: g.menu_category, amount: amount});
                });
              }
            });
            count_periods += 1;
          } else if (count_periods >= 3) {
            // пересчитываем как новый
            _.each(groups_new, function (group, category_id) {
              var amount = '';
              if (category_id != null) {
                var norm = _.find(norms, function (iter, iter_k) {
                  return iter.menu_category == category_id;
                });
                var count_already = 0;
                _.each(val, function (time_lst, time) {
                  var tmp_l = _.filter(time_lst, function (ic) {
                    return ic['menu_category'] == category_id;
                  });
                  count_already += tmp_l.length;
                });
                amount = norm['amount'] / (count_already + group.length);
                //пересчитываем у старых продуктов
                _.each(val, function (time_lst, time) {
                  _.each(time_lst, function (ic) {
                    if (ic['menu_category'] == category_id) {
                      ic['amount'] = amount;
                    }
                  });
                });
              }
              _.each(group, function (g) {
                lst[date][g['time']].push({id: g.id, is_new: false, menu_category: g.menu_category, amount: amount});
              });
            });
          }
          if (i == keys.length - 1) {
            deferred.resolve(lst);
          }
          i += 1;
        });
      } else {
        deferred.resolve(lst);
      }
      return deferred.promise;
    }).then(function(lst){
      var deferred = $q.defer();
      if(feeding.length > 0){
        _.each(lst, function(day, date){
          var time_keys = _.keys(day);
          _.each(feeding, function(item){
            var time = item['val'];
            if(_.indexOf(time_keys, time) != -1){
              // время в списке уже есть
              var tmp = day[time];
              tmp = tmp.concat([{
                type: feeding_type,
                time: time
              }]);
              day = tmp;
            }else{
              day[time] = [{
                type: feeding_type,
                time: time
              }];
            }
          })
        });
        deferred.resolve(lst);
      }else{
        deferred.resolve(lst);
      }
      return deferred.promise;
    }).then(function(rows){
      console.log("RESULT", rows);
      main_deferred.resolve(rows);
    });
    return main_deferred.promise;
  }

  function genDbDay(day, date){
    var deferred = $q.defer();
    var tasks = [];
    _.each(day, function(group, time){
      tasks.push(
        DbTimer.getOrCreate(date, time).then(function(id) {
        _.each(group, function (val) {
          genDbRation(id, val);
        });
        })
      );
    });
    $q.all(tasks).then(function(){
      deferred.resolve();
    });
    return deferred.promise;
  }

  function genDbRation(timer_id, item){
    //добавляем прием пищи
    var deferred = $q.defer();
    if(item.type !== undefined){
      DbFeeding.add({
        timer: timer_id,
        type: item.type
      }).then(function(res){
        deferred.resolve();
      });
    }else{
      DbRation.add({
        timer: timer_id,
        is_new: (item.is_new) ? 1 : 0,
        amount: item.amount,
        product_id: item.id
      }).then(function(res){
        deferred.resolve();
      });
    }
    return deferred.promise;
  }

  function genDb(menu){
    var main_deferred = $q.defer();
    var chain = [];
    _.each(menu, function(day, date){
      chain.push(genDbDay(day, date));
    });
    $q.all(chain).then(function(){
      main_deferred.resolve();
    });
    return main_deferred.promise;
  }

  $scope.gen = function(){
    $ionicLoading.show({
      template: 'Формирование меню...'
    });
    genDays(times);
    genMenu(days).then(function(items){
      console.log('complete');
      genDb(items).then(function(){
        $ionicLoading.hide();
        $state.go('app.main');
      });
    });
  }
})

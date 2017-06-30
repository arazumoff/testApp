angular.module('babytask.controllers')

.controller('mainPageCtrl', function($scope, $stateParams, $q, $ionicModal, $ionicPopup, $ionicActionSheet, $sce, _,
        IonicClosePopupService, DbTimer, DbRation, DbFeeding, DbProduct, DbCategory, Utils, MASTER_CONFIG) {
  console.log($stateParams);

  $scope.isMagic = false; // bottom menu
  $scope.month = moment().day(1);

  var times = MASTER_CONFIG.PRODUCT_FEEDING_TIME;
  $scope.times = [];
  $scope.groups = {};

  $scope.reSort = function(){
    $scope.times = _.sortBy($scope.times, function(item){
      return new Date('1970/01/01 '+item.timer_time);
    });
  };

  $scope.day = Date.today();
  if($stateParams.date !== undefined){
    $scope.day = moment($stateParams.date).toDate();
  }

  $scope.setPart = function($e, item, val){
    $e.stopPropagation();
    item.part = val;
    if(item.value !== undefined){
      item.complete = true;
    };
    DbFeeding.setPart(item.rowid, val);
    if(item.start_time !== undefined && item.stop_time !== undefined){
      DbFeeding.setComplete(item.rowid, 1);
    }
  };

  $scope.changeGroupName = function(item){
    $scope.data = {
      time: new Date('1970/01/01 ' + item.timer_time),
      name: item.name || "Кормление"
    };
    console.log(item.name);
    $ionicModal.fromTemplateUrl('changeGroupNameTpl.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });

    $scope.changeGroupNameComplete = function(){
      console.log(item.rowid);
      console.log($scope.data);

      var t = new Date($scope.data.time);
      var time = Utils.addZero(t.getHours())+':'+Utils.addZero(t.getMinutes());

      DbTimer.update(item.rowid, time, $scope.data.name).then(function(){
        item.name = $scope.data.name;
        item.timer_time = time;
        $scope.modal.hide();
      });
    };
  };

  //попап выбора времени кормления
  $scope.openPopupTime = function($e, item){
    $e.stopPropagation();
    $scope.data = {
      start_hour: 10,
      start_minuts: 20,
      stop_hour: 10,
      stop_minuts: 24,
    };
    var myPopup = $ionicPopup.show({
      templateUrl: 'selectTime.html',
      title: 'Время кормления',
      cssClass: 'time-popup',
      scope: $scope,
      buttons: [{ text: 'Отмена' },
        { text: '<b>Готово</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.start_hour) {
              e.preventDefault();
            } else {
              var start = $scope.data.start_hour+':'+$scope.data.start_minuts;
              var stop = $scope.data.stop_hour+':'+$scope.data.stop_minuts;
              return {'stop': stop, 'start': start};
            }
          }
        }
      ]
    });
    $scope.up = function(val, maximus){
      if ($scope.data[val] == maximus){
        $scope.data[val] = 0;
      }else{
        $scope.data[val]+=1;
      }
    };
    $scope.down = function(val, next){
      if($scope.data[val] == 0){
        $scope.data[val] = next;
      }else{
        $scope.data[val]-=1;
      }
    };
    myPopup.then(function(res) {
      item.value = res['start'] +' - '+ res['stop'];
      if(res['start'] !== undefined){
        DbFeeding.setTime(item.rowid, res['start'], res['stop']);
        if(item.part !== undefined){
          item.complete = true;
        }
      }
    });
  }

  $scope.changeDay = function(val){
    $scope.day = Utils.getDay($scope.day, val);
    selectDay($scope.day);
  };

  function selectDay(val){
    $q.when()
      .then(function(){
        var deferred = $q.defer();
        DbTimer.getForDay(moment(val).format('YYYY-MM-DD')).then(function(items){
          console.log('TIMERS', items);
          deferred.resolve(items);
        });
        return deferred.promise;
      })
      .then(function(timers){
        var deferred = $q.defer();
        DbFeeding.getForDayFromTimers(moment(val).format('YYYY-MM-DD')).then(function(items){
          items = _.each(items, function(it){
            if(it.start_time != undefined && it.stop_time !== undefined){
              it['value'] = it.start_time +' - '+it.stop_time;
            }
          });
          deferred.resolve({'feeding':items, 'timers': timers});
        });
        return deferred.promise;
      })
      .then(function(data){
        var deferred = $q.defer();
        DbRation.getForDayFromTimers(moment(val).format('YYYY-MM-DD')).then(function(items){
          data['items'] = items;
          deferred.resolve(data);
        });
        return deferred.promise;
      })
      .then(function(result){
        var feeding = result['feeding'];
        var items = result['items'];
        var timers = result['timers'];

        var group_items = _.groupBy(items, function(it){return it.timer_id});
        var keys_items = _.map(_.keys(group_items), function(it){return it*1;});
        var group_feeding = _.groupBy(feeding, function(it){return it.timer_id;});
        var keys_feeding = _.map(_.keys(group_feeding), function(it){return it*1;});

        _.each(timers, function(iter){
          var items = [];
          if(_.indexOf(keys_items, iter.rowid) != -1){
            items = items.concat(group_items[iter.rowid]);
          }
          if(_.indexOf(keys_feeding, iter.rowid) != -1){
            items = items.concat(group_feeding[iter.rowid]);
          }
          iter['items'] = items;
        });
        $scope.times = _.sortBy(timers, function(item){
          return new Date('1970/01/01 ' + item.timer_time);
        });
      });
  }
  selectDay($scope.day);
  var feeding = $scope.user.feeding_times;

  //удаление записи из меню
  $scope.deleteItem=function($e, $ind, item, time){
    $e.stopPropagation();
    var tpl = 'Вы хотите удалить &quot;'+item.name+'&quot; из рациона на '+time.name+'?';
    if(item.type !== undefined){
      tpl = 'Вы хотите удалить запись?';
    }
    var confirmPopup = $ionicPopup.confirm({
      title: 'Удаление',
      cssClass: 'delete-popup',
      template: tpl,
      cancelText: 'Отмена',
      okText: 'Удалить',
    });
    confirmPopup.then(function(res) {
      if(res) {
        if(item.type !== undefined){
          //DbFeeding.setDelete(item.ration_id);
        }else{
          //DbRation.setDelete(item.ration_id);
        }
        item.deleted = 1;
      }
    });
  };

  // статус продукта
  $scope.setStatus = function($e, item){
    $e.stopPropagation();
    if(ionic.Platform.isAndroid()){
      var myPopup = $ionicPopup.show({
        title: 'Статус',
        cssClass: 'android-popup',
        scope: $scope,
        templateUrl: 'statusTpl.html',
      });
      $scope.selectStatus = function(index){
        item.status=index;
        DbRation.setStatus(item.ration_id, index);
        myPopup.close();
      };
      IonicClosePopupService.register(myPopup);
    }else{
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Реакция' },
          { text: 'Сомнительный' },
          { text: 'Нормальный' },
        ],
        cancelText: 'Отмена',
        cancel: function() {
          // add cancel code..
        },
        buttonClicked: function(index) {
          console.log(index);
          item.status=index+1;
          DbRation.setStatus(item.ration_id, index+1);
          return true;
        }
      });
    }
  };

  // замена продукта
  $scope.changeProductPopup = function($e, item){
    $e.stopPropagation();

    $q.when()
      .then(function(){
        var defer = $q.defer();
        DbProduct.getAllFromCategoryMenu(item.menu_category).then(function(items){
          defer.resolve(items);
        });
        return defer.promise;
      })
      .then(function(items){
        $scope.changeList = items;
        $scope.choice = {data:item};
        $ionicModal.fromTemplateUrl('changeProduct.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
        $scope.changeComplete = function(t){
          var id = $scope.choice.data.rowid;
          DbRation.changeProduct(item.ration_id, id).then(function(){
            item.product_id = id;
            item.name = $scope.choice.data.name;
            $scope.modal.hide();
          });
        };
      });
  };

  $scope.openCommentPopup = function($e, item){
    $e.stopPropagation();
    $scope.item = item;
    $ionicModal.fromTemplateUrl('addComment.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });

    $scope.savePopupComment = function(){
      if ($scope.item.type != undefined){
        DbFeeding.setComment($scope.item.rowid, $scope.item.comment);
      }else{
        DbRation.setComment($scope.item.ration_id, $scope.item.comment);
      }
      $scope.modal.hide();
    }
  };

  // покормить
  $scope.feedPopup = function($e, item){
    $e.stopPropagation();
    $scope.item = item;
    $scope.variants = [1, 2, 3, 4];

    var range = function (min, max, step) {
      var input = [];
      for (var i = min; i <= max; i += step) {
        input.push(i);
      }
      return input;
    };
    $scope.variants = $scope.variants.concat(range(5, 300, 5));

    if(ionic.Platform.isAndroid()){
      var myPopup = $ionicPopup.show({
        title: item.name,
        cssClass: 'android-feed-popup',
        scope: $scope,
        templateUrl: 'feedTpl.html',
      });
      $scope.setFeed = function(index){
        if(item.type !== undefined){
          DbFeeding.setAmount(item.rowid, index);
        }else{
          DbRation.setAmount(item.ration_id, index);
        }
        item.amount = index;
        item.complete = true;
        myPopup.close();
      };
      IonicClosePopupService.register(myPopup);
    }else {
      $ionicModal.fromTemplateUrl('feedPopup.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });

      $scope.okFeed = function (v) {
        $scope.item.value = v;
        $scope.modal.hide();
      }
    }
  };

  $scope.clickMagic = function(){
    $scope.isMagic=true;
    console.log('click');
  };

  // добавить кормление
  $scope.addFeed = function(){
    $scope.isMagic = false;
    $scope.data = {
      type: null,
      time:  null
    };
    $ionicModal.fromTemplateUrl('addFeed.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });

    $scope.addFeedComplete = function(){
      if($scope.data.type != null && $scope.data.time != null){
        var t = new Date($scope.data.time);
        var time = Utils.addZero(t.getHours())+':'+Utils.addZero(t.getMinutes());
        console.log(time, $scope.data.type);
        var types_map = {'A':1, 'B': 2, 'C':3};
        //мапим категорию кормления
        var feeding_type = types_map[$scope.data.type];
        var keys_times = _.map($scope.times, function(it){
          return it.timer_time;
        });

        DbTimer.getOrCreate(moment($scope.day).format('YYYY-MM-DD'), time, true).then(function(id){
          DbFeeding.add({timer: id, type: feeding_type}).then(function(row){
            var new_item = {type: feeding_type, rowid: row.insertId};
            if(_.indexOf(keys_times, time)!= -1){
              // уже есть в списке
              // надо добавить новое кормление
              var lst = _.find($scope.times, function(it){return it.timer_time == time});
              lst['items'].push(new_item);
            }else{
              $scope.times.push({
                timer_time: time,
                items:[new_item]
              });
            }
            $scope.times = _.sortBy($scope.times, function(item){
              return new Date('1970/01/01 '+item.timer_time);
            });
            $scope.modal.hide();
          });
        });
      }
    }
  }

  // добавить прием пищи
  $scope.addEating = function(){
    $scope.isMagic = false;
    $scope.eating_times = _.filter(MASTER_CONFIG.PRODUCT_FEEDING_TIME, function(it){return !_.isArray(it.val);});
    $scope.data = {
      var: null,
      time: null
    };
    $ionicModal.fromTemplateUrl('addEating.html', {
      scope: $scope,
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });

    $scope.addEatingComplete = function(){
      var data = $scope.data;
      console.log($scope.day);
      console.log($scope.data);

      var keys_times = _.map($scope.times, function (it){return it.timer_time;});

      if(data.time != null && data.var != null){
        //проверяем, есть ли такое время уже сегодня
        if(_.indexOf(keys_times, data.time) == -1) {
          // добавляем обычный, но изменяем время
          var t = new Date(data.time);
          var time = Utils.addZero(t.getHours()) + ':' + Utils.addZero(t.getMinutes());
          DbTimer.add({
            created : moment($scope.day).format('YYYY-MM-DD'),
            date : moment($scope.day).format('YYYY-MM-DD'),
            time : data.time,
            name : data.var.name
          }).then(function(){
            $scope.times.push({timer_time:time, name: data.var.name, items:[]});
            $scope.modal.hide();
          });
        }
      }else if(data.time == null && data.var != null){
        //проверяем, есть ли такое время уже сегодня
        if(_.indexOf(keys_times, data.var.time) == -1){
          //добавляем обычный прием
          DbTimer.add({
            created : moment($scope.day).format('YYYY-MM-DD'),
            date : moment($scope.day).format('YYYY-MM-DD'),
            time : data.var.val,
            name : data.var.name
          }).then(function(){
            $scope.times.push({timer_time: data.var.val, name:data.var.name, items:[]});
            $scope.times = _.sortBy($scope.times, function(item){
              return new Date('1970/01/01 ' + item.timer_time);
            });
            $scope.modal.hide();
          });
        }
      }
    }
  }

  $scope.addNewInMain = function(itemGroup){
    $scope.data = {
      name: null,
      time: itemGroup.timer_time,
      timeName: null,
      selectedProduct: null,
      selectedCategory: null,
    };
    $scope.ProductFeedingTime = _.filter(MASTER_CONFIG.PRODUCT_FEEDING_TIME, function(it){return !_.isArray(it.val);});
    $scope.isOpenSelectorTime = false;
    $scope.category_list = [];
    $scope.product_list = [];
    $scope.selectedProduct = null;
    $scope.selectedCategory = null;
    $ionicModal.fromTemplateUrl('addOwnProduct.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });

    $scope.setTimeClickOpen = function(){
      $scope.isOpenSelectorTime=true;
    }

    $scope.setTimeCustom = function(time){
      $scope.data.time = time.val;
      $scope.isOpenSelectorTime = false;
    }

    $scope.viewProducts = function(){
      DbProduct.all().then(function(items){
        $scope.product_list = items;
      });
      var myPopup = $ionicPopup.show({
        title: 'Список продуктов',
        cssClass: 'popup-categories-own-product',
        templateUrl: 'popupProductList.html',
        scope: $scope,
        buttons: [{ text: 'Отмена' },
          {text: 'Выбрать',
            onTap: function(e) {
              if (!$scope.data.selectedProduct) {
                e.preventDefault();
              } else {
                return $scope.data;
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        $scope.data.name  = $scope.data.selectedProduct.name;
        $('#own_product_name').focus();
      });
    };

    $scope.viewCategories = function(){
      DbCategory.all().then(function(items){
        $scope.category_list = items;
      });
      var myPopup = $ionicPopup.show({
        title: 'Категория',
        cssClass: 'popup-categories-own',
        templateUrl: 'popupCategoryList.html',
        scope: $scope,
        buttons: [{ text: 'Отмена' },
          {text: 'Выбрать',
            onTap: function(e) {
              if (!$scope.data.selectedCategory) {
                e.preventDefault();
              } else {
                return $scope.data;
              }
            }
          }
        ]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
    };

    $scope.addOwnProductComplete = function(){
      console.log('Yes', itemGroup, $scope.data);
      if(($scope.data.name ==null || $scope.selectedProduct == null) &&
        ($scope.data.time == null && $scope.data.selectedCategory == null)){
        return;
      }

      if($scope.data.name != null && $scope.data.selectedProduct == null){
        DbProduct.add({
          id: null,
          name: $scope.data.name,
          description: '',
          category: $scope.data.selectedCategory.rowid,
          menu_category: null
        }).then(function(row){
          DbProduct.getById(row.insertId).then(function(item){
            DbRation.add({
              timer: itemGroup.rowid,
              product_id : row.insertId,
              is_new: 1,
              amount: ''
            }).then(function(new_r){
              item['is_new'] = 1;
              item['ration_id'] = new_r.insertId;
              item['time'] = $scope.data.time;
              item['feeding_time'] = $scope.data.time;
              itemGroup.items.push(item);
              $scope.modal.hide();
            });
          });
        });
      }else if($scope.data.selectedProduct != null){
        var item = $scope.data.selectedProduct;
        DbRation.add({
          timer: itemGroup.rowid,
          product_id : item.rowid,
          is_new: 0,
          amount: ''
        }).then(function(new_r){
          item['ration_id'] = new_r.insertId;
          item['time'] = $scope.data.time;
          item['feeding_time'] = $scope.data.time;
          itemGroup.items.push(item);
          $scope.modal.hide();
        });
      }
    }
  };

})

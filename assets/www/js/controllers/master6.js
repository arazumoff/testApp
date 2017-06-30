angular.module('babytask.controllers')

// контроллер 6го шага
.controller('master6Ctrl', function($scope, $q, $state, $sce, $ionicPopup, _, localStorageService,
                                    EditMode, DbProduct, DbCategory, DbNorm, MASTER_CONFIG) {
  $scope.products = [];
  $scope.products_new = [];
  $scope.category = {};
  $scope.ProductFeedingTime = MASTER_CONFIG.PRODUCT_FEEDING_TIME;

  if(localStorageService.get('products_enable') != null){
    var already = JSON.parse(localStorageService.get('products_enable'));

    var added = _.filter(already, function(it){return it.added == true;});
    var already_ids = _.map(added, function(it){return it.id;});
    var lst_new_entered = null
    DbProduct.getNotEnable(already_ids).then(function(items){
      if(!EditMode.mode){
        var lst_new_entered = _.filter(already, function(it){return it.added == false;});
        var ids = _.map(lst_new_entered, function(it){return it.id;});
        $scope.products_new = lst_new_entered;
        console.log(ids);
      }
      $scope.products = _.each(items, function(n){
        var val = 0;
        if(_.indexOf(ids, n.rowid) != -1){
          var tmp = _.find(lst_new_entered, function(it){return it.id == n.rowid});
          tmp = _.find(MASTER_CONFIG.PRODUCT_FEEDING_TIME, function(it){return it.val == tmp['time']});
          val = tmp;
        }
        n['feeding_time']= val;
      });
    });
  }else{
    DbProduct.all().then(function(items){
      $scope.products = _.map(items, function(n){return angular.extend({'feeding_time':0}, n);});
    });
  }

  DbCategory.all().then(function(items){
    angular.forEach(items, function(item){
      $scope.category[item.ext_id] = {
        id:item.ext_id,
        name: item.name,
        count: 0
      };
    });
    /*
     var first_category;
     for (first_category in $scope.category) break;
     $scope.chCat = first_category;
     */
  });

  // счетчик новых категорий
  $scope.recharge = function (category_id) {
    var pp = 0;
    angular.forEach($scope.products_new, function(item){
      if (item.added && item.category == category_id) {
        pp++;
      }
    });
    $scope.category[category_id]['count']=pp;
  };

  $scope.onChange6 = function(item){
    // check has norms
    console.log("STEP 6 ", item.feeding_time, item);
    console.log($scope.products_new);
    if (item.feeding_time == null){
      // delete item
      _.each($scope.products_new, function(el, i){
        if(el.id == item.rowid){
          delete $scope.products_new[i];
          return;
        }
      });
    }else{
      DbNorm.checkCategoryForAge(item.menu_category, $scope.user.count_month).then(function(items){
        if(items != undefined && items.length > 0){
          refill6(item);
        }else{
          item.feeding_time = '';
          $ionicPopup.alert({
            title: 'Внимание',
            cssClass: 'delete-popup',
            template: 'Этот продукт не подходит для возраста ребенка!'
          });
        }
      });
    }
    console.log($scope.products_new);
  };

  function refill6(item){
    if($scope.products_new[0] !== undefined && item.rowid !=""
      && _.find($scope.products_new, function(row){return row.id!= underfined && row.id == item.rowid;}) != undefined){
      return;
    }else{
      var times = item.feeding_time.val;
      if(!_.isArray(times)){
        times = [times];
      }
      _.each(times, function(time){
        $scope.products_new.push({
          added: false,
          id: item.rowid,
          time: time,
          menu_category: item.menu_category,
          category: item.ext_category
        });
      });
    }
    $scope.recharge(item.ext_category);
  }

  $scope.save6 = function(){
    if(localStorageService.get('products_enable') != null) {
      var lst = JSON.parse(localStorageService.get('products_enable'));
      var new_lst = $scope.products_new;
      lst = lst.concat(new_lst);
    }else{
      var new_lst = $scope.products_new;
      var lst = new_lst;
    }

    if(EditMode.mode && EditMode.renew){
      //удаляем новые введеные продукты
      DbRation.clearFromDate(moment().format('YYYY-MM-DD')).then(function(){
        localStorageService.set('products_enable', JSON.stringify(lst));
        $state.go('master/step_7');
      });
    }else if(EditMode.mode){

    }else{
      if(lst_new_entered != null && lst_new_entered[0] !== undefined){
        // если были введены новые продукты
        // надо их удалить или обновить
        // или обновить нормы,
      }
      console.log(JSON.stringify(lst));
      localStorageService.set('products_enable', JSON.stringify(lst));
      $state.go('master/step_7');
    }
  };
})

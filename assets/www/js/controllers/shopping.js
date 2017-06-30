angular.module('babytask.controllers')

.controller('shoppingListCtrl', function($scope, DbRation){
  //var products = [];
  $scope.period = 1;
  $scope.count_days_end = moment().add(1, 'months').date(0).diff(moment(), 'days')+1;

  $scope.selectPeriod=function(i){
    $scope.period = i;
    switch(i){
      case 1:
        getList();
        break;
      case 2:
        getList(moment().add(7, 'days').format('YYYY-MM-DD'));
        break;
      case 3:
        getList(moment().add($scope.count_days_end, 'days').format('YYYY-MM-DD'));
        break;
    }
  };

  $scope.pushNotificationChange = function(item){
    console.log('eqweqw', item.complete);
    if(item.complete == 0){
      item.complete = 1;
    }else{
      item.complete = 0;
    }
  };

  function getList(stop){
    var start = moment().format('YYYY-MM-DD');
    DbRation.getShopping(start, stop).then(function(items){
      $scope.products = items;
    });
  }
  getList();
})

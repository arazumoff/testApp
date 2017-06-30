angular.module('babytask.controllers')

.controller('productsCtrl', function($scope, _, Products, DbProduct, PRODUCT_STATUS) {
  $scope.statusProd = PRODUCT_STATUS;
  $scope.pp = 1;

  $scope.chooseProds = function (id) {
    $scope.pp = id;
    if(id == 3){
      DbProduct.getEntered().then(function(items){
        $scope.productsSort = items;
      });
    }else{
      DbProduct.getProductWithStatus(id).then(function(items){
        $scope.productsSort = items;
      });
    }
  };
  DbProduct.getProductWithStatus($scope.pp).then(function(items){
    $scope.productsSort = items;
  });
})

.controller('productDetailCtrl', function($scope, $stateParams, $ionicPopup,
            IonicClosePopupService, $ionicActionSheet, DbProduct, DbRation) {
  $scope.product = null;
  DbProduct.getById($stateParams.prodId).then(function(item){
    console.log(item);
    $scope.product = item;
  });
  $scope.dateNow = Date.now();
  $scope.oneProd = {
    open: undefined
  }

  DbRation.getAllForProduct($stateParams.prodId).then(function(items){
    $scope.history = _.each(items, function(item){
      item['day'] = moment.utc(item.created).format("D");
      item['month'] = moment.utc(item.created).format("M");
    });
    console.log(items);
  });

  $scope.openProdItem = function (item) {
    $scope.oneProd.open = item;
  };

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
        DbRation.setStatus(item.rowid, index);
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
})

.controller('productCommentCtrl', function($scope, $stateParams, $log, Products) {
  $scope.product = Products.getProduct($stateParams.prodId);
  $scope.histcom = $stateParams.normIndex;
  //$log.log($scope.product.history[$scope.histcom]);
})

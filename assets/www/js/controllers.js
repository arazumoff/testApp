angular.module('babytask.controllers')

.controller('MainCtrl', function($scope, $ionicHistory,
             $state, $sce, $rootScope, $window, $log, localStorageService, Products, MASTER_CONFIG) {
  $log.log('main');

  $scope.editMode = false;

  $scope.saveGame = function () {
    var str = JSON.stringify($scope.user);
    localStorageService.set('BabyDate', str);
    $log.log({'game saved': str});
    $scope.loadGame();
  };
  $scope.loadGame = function () {
    var obj = JSON.parse(localStorageService.get('BabyDate'));
    if (obj.birthday != ""){
      obj.birthday = new Date(obj.birthday);
      obj.count_month = moment().diff(moment(obj.birthday), 'months');
      obj.count_days = moment().diff(moment(obj.birthday), 'days');
      console.log("COUNT MONTH", obj.count_month);
    }
    $scope.user = obj;
  };

  $scope.saveAndGo = function(path){
    $scope.saveGame();
    $state.go(path);
  }

  $scope.goTo = function(path){
    $state.go(path);
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }

  if (localStorageService.get('BabyDate') != null) {
    $scope.loadGame();
    $log.log({'Load User': $scope.user})
  }else {
    $scope.user = {
      id: 1,
      sex: undefined,
      files: undefined,
      name: undefined,
      birthday: undefined,
      feeding_on_demand: false,
      feeding_type: undefined,
      feeding_times: [],
      feeding_exist: 0,
      profileProduct: [],
      days_for_adding: 0,
      babyOld: 12,
      babyOldD:360,
      step4Data:0,
      ready: false
    };
    $log.log('newUser');
  }

  $scope.chCat = 1;

  $scope.url = false;
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    $scope.url = toState.url;
  });

  $scope.getDay = function (pr) {
    var tomorrow;
    if (pr == 'tm') {
      tomorrow = new Date($scope.general.date.getTime() + (24 * 60 * 60 * 1000));
    }else {
      tomorrow = new Date($scope.general.date.getTime() - (24 * 60 * 60 * 1000));
    }
    $scope.general.date = tomorrow;
  };

  Date.CultureInfo["monthNames"] = ["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"];
  $scope.general = {
    date:  Date.today(),
  };

  //Функция обрезания длины строки по заданому размеру
  $scope.sliceText = function (text, limit) {
    text = text.trim();
    if( text.length <= limit) return text;
    text = text.slice( 0, limit);
    lastSpace = text.lastIndexOf(" ");
    if( lastSpace > 0) {
      text = text.substr(0, lastSpace);
    }
    return text + "...";
  };

  //Функция получающая час и возвращающая таймстамп с полночи 1970, (учитывает часовой пояс)
  $scope.releaseDate = function (hours) {
    var d = new Date();
    var gtm = d.getTimezoneOffset() * 60000;
    if (gtm <= 0) {
      var prs = (hours * 60 * 60 * 1000) + gtm;
    }
    else {
      var prs = (hours * 60 * 60 * 1000) - gtm;
    }
    var endT = new Date(prs)
    return endT;
  };

  //Функция получающая кол-во месяцев и возвращающая таймстамп с полночи 1970, (учитывает часовой пояс)
  $scope.releaseMon = function (month) {
    var d = new Date();
    var gtm = d.getTimezoneOffset() * 60000;
    if (gtm <= 0) {
      var prs = (month * 24 * 30 * 60 * 60 * 1000) + gtm;
    }
    else {
      var prs = (month * 24 * 30 * 60 * 60 * 1000) - gtm;
    }
    var endT = new Date(prs)
    return endT;
  };

 // делаем дефолтное меню в случае если юзер не стал заморачиваться
 $scope.getDefaulMenu = function () {

 };

  $scope.ProductFeedingTime = MASTER_CONFIG.FEEDING_TIME;

  $scope.chooseCat5 = function ($ind, item) {
    $scope.chCat = item;
    $('.linki-tab-item').removeClass('active');
    $('.linki-tab-item:eq('+$ind+')').addClass('active');
  };

  // добавить пустой объект продукта
  $scope.addProd = function () {
    var leng = $scope.user.products.length + 1;
    $scope.user.products.push({
      "id": leng,
      "name": '',
      "description": "",
      "category": $scope.chCat,
    });
  };

  // удаление продукта
  $scope.clearProd = function (item) {
    for (var i = 0; i < $scope.user.products.length; i++) {
      if ($scope.user.products[i].id== item.id) {
        $scope.user.products.splice(i, 1);
        break;
      }
    }
  };

  $scope.cAddNew = function(){
    consolelog('test');
  }
})

 // контроллер мастера, шагов 1-4, 7
.controller('masterCtrl', function($scope, $sce, $ionicPopup, ionicDatePicker, MASTER_CONFIG) {
  $scope.errors ={};
  $scope.openDatePicker = function(e){
    e.stopPropagation();
    e.preventDefault();
    //$scope.user.birthday = null;
    ionicDatePicker.openDatePicker({
      dateFormat: 'DD.MM.YYYY',
      setLabel: 'ПРИМЕНИТЬ',
      closeLabel: 'ОТМЕНА',
      callback: function (val) {
        var conv = new Date();
        conv.setTime(val);
        //$scope.user.birthday = ("0"+conv.getDate()).slice(-2)+'.'+("0" + (conv.getMonth() + 1)).slice(-2)+'.'+conv.getFullYear();
        $scope.user.birthday = conv;
        $('#id-birthday').focus();
        console.log(val);
      }
    });
  }

  $scope.tic = function(){
    /*
    if($scope.user.photo == '' || $scope.user.photo === undefined){
      $scope.errors['photo'] = 1;
    }else{
      $scope.errors['photo'] = 0;
    }
    */
    if($scope.user.name == ''){
      $scope.errors['name'] = 1;
    }else{
      $scope.errors['name'] = 0;
    }
    if($scope.user.birthday == ''){
      $scope.errors['birthday'] = 1;
    }else{
      $scope.errors['birthday'] = 0;
    }
    if($scope.user.name  && $scope.user.birthday && $scope.user.sex!== undefined){
      $scope.saveAndGo('master/step_2');
    }
  }

  $scope.uploadedFile = function(element) {
    console.log('open upload');
    var file = element.files[0];

    var reader = new FileReader();
    reader.onload = function (e) {
      var options = {debug:true, width: 120, height: 120};
      var img = new Image();
      img.onload = function(){
        SmartCrop.crop(img, options, function(result){
          var crop = result.topCrop, canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
          canvas.width = options.width;
          canvas.height = options.height;
          ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
          var src = canvas.toDataURL();
          console.log('photo');

          $scope.$apply(function($scope) {
            $scope.user.photo = src;
            $('.default_avatar').hide();
            $('.img').show().attr('src', src);
            $scope.errors.photo = 0;
          });
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Шаг 4
  $scope.gofrom4ToMain = function () {
    var alertPopup = $ionicPopup.alert({
      title: 'Поздравляем!',
      template: 'Вы составили меню на месяц'
    });
    alertPopup.then(function(res) {
      $scope.getDefaulMenu();
      $scope.saveGame();
      $state.go('app.main');
    });
    return false;
  };
})

.controller('master3Ctrl', function($scope, $state, $ionicLoading, $q, localStorageService, _,
    DbFeeding, DbTimer, EditMode, MASTER_CONFIG){
  $scope.periods = MASTER_CONFIG.PERIOD;
  var feeds = [];

  console.log(EditMode.mode);

  $scope.feedTimes = MASTER_CONFIG.FEED_TIMES;

  $scope.add_feedTime = function () {
    $scope.feedTimes.push({
      id: $scope.feedTimes.length + 1,
      time: $scope.releaseDate(0),
      is_choose: false,
      feeding_set: $scope.feedTimes.length + 1
    });
  };

  $scope.appendFeed = function (item) {
    item.is_choose=!item.is_choose
    if(item.is_choose){
      feeds.push(item);
      console.log(item);
      console.log(feeds);
    }
  }

  $scope.save3 = function(){
    if(feeds.length > 0){
      localStorageService.set('feeds', JSON.stringify(feeds));
    }
    if(EditMode.mode){
      $ionicLoading.show({template: 'Обновляем меню...'});
      if($scope.user.feeding_on_demand){
        //delete old feeds
        DbFeeding.clearFromDate(moment().format('YYYY-MM-DD')).then(function(){
          $ionicLoading.hide();
          EditMode.mode = false;
          $state.go('app.main');
        });
      }else{
        DbFeeding.clearFromDate(moment().format('YYYY-MM-DD')).then(function() {
          updateFeeds($scope).then(function () {
            $ionicLoading.hide();
            EditMode.mode = false;
            $state.go('app.main');
          });
        });
      }
    }else{
      $state.go('master/step_4');
    }
  }

  function updateFeeds(scope){
    var main_deferred = $q.defer();
    var count = 30;
    $q.when().then(function(){
      var i = 0;
      var days = {};
      var times_feed = _.map(feeds, function(item){return moment(item['time']).format('HH:mm');});

      console.log(times_feed);

      var deferred = $q.defer();
      for (var i = 0; i < count; i++) {
        var date = moment().add(i, 'days');
        var times_day = {};
        _.each(times_feed, function(item){
          times_day[item] = [];
        });
        console.log('erev', i);
        days[date.format('YYYY-MM-DD')] = times_day;
        if(i == count - 1){
          console.log('ere');
          deferred.resolve(days);
        }
      }
      return deferred.promise;
    }).then(function(days){
      var deferred = $q.defer();
      var types_map = {'A':1, 'B': 2, 'C':3};
      //мапим категорию кормления
      var feeding_type = types_map[$scope.user.feeding_type];

      var tasks = [];
      _.each(days, function(group, date){
        _.each(group, function (val, key) {
          tasks.push(
            DbTimer.getOrCreate(date, key, true).then(function(id) {
              return DbFeeding.add({
                timer : id,
                type : feeding_type
              });
            })
          );
        })
      });
      console.log('COUNT ', tasks.length);
      $q.all(tasks).then(function(){
        deferred.resolve();
      });
      return deferred.promise;
    }).then(function(){
      main_deferred.resolve();
    });
    return main_deferred.promise;
  }
})

.controller('master5Ctrl', function($scope, $ionicPopup, $ionicModal, $q, $state, $sce, $log, _, DbNorm,
   localStorageService, DbCategory, DbProduct, MASTER_CONFIG) {
  $scope.category = {}; // список категорий
  $scope.products = []; // список продуктов
  $scope.products_enable = []; // продукты для добавления
  $scope.ProductFeedingTime = MASTER_CONFIG.PRODUCT_FEEDING_TIME;

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

  DbProduct.all().then(function(items){
    $scope.products = items;
  });

      $scope.onChange = function(item){
    // check has norms
    if(item.menu_category === undefined || item.menu_category == null){
      refill(item);
    }else{
      DbNorm.checkCategoryForAge(item.menu_category, $scope.user.count_month).then(function(items){
        if(items != undefined && items.length > 0){
          refill(item);
        }else{
          item.feeding_time = '';
          $ionicPopup.alert({
            title: 'Внимание',
            cssClass:'delete-popup',
            template: 'Этот продукт не подходит для возраста ребенка!'
          });
        }
      });
    }
  };

  function refill(item){
    if(item.rowid !="" && _.find($scope.products_enable, function(row){return row.id == item.rowid;}) != undefined){
      return;
    }else{
      var times = item.feeding_time.val;
      if(!_.isArray(times)){
        times = [times];
      }
      _.each(times, function(time){
        $scope.products_enable.push({
          added: true,
          //item: item,
          id: item.rowid,
          time: time,
          menu_category: item.menu_category,
          category: item.ext_category
        });
      });
    }
    $scope.recharge(item.ext_category);
  }

  // счетчик новых категорий
  $scope.recharge = function (category_id) {
    var pp = 0;
    angular.forEach($scope.products_enable, function(item){
      if (item.added && item.category == category_id) {
        pp++;
      }
    });
    $scope.category[category_id]['count']=pp;
  };

  $scope.save = function(){
    if($scope.products_enable.length == 0){
      var confirmPopup = $ionicPopup.confirm({
        title: 'Нет отмеченных продуктов',
        cssClass:'delete-popup',
        cancelText: 'Вернуться',
        okText:'Продолжить',
        template: 'Вы не отметили ни одного продукта, значит вы только начинаете прикорм'
      });
      confirmPopup.then(function(res) {
        if(res) {
          $state.go('master/step_6');
        } else {
          return;
        }
      });
    }else{
      var lst = JSON.stringify($scope.products_enable);
      console.log(lst);
      if(lst.length > 0){
        localStorageService.set('products_enable', lst);
      }
      $state.go('master/step_6');
    }
  };

  $scope.addNew = function(){
    $scope.data = {
      name: null,
      time: null,
      selectedProduct: null,
      selectedCategory: null,
    };
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

    $scope.search = function(){

    };

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
        console.log('Tapped!', res);
        $scope.data.name  = $scope.data.selectedProduct.name;
        $('#own_product_name').focus();
        $scope.data.selectedProduct = null;
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
      if($scope.data.name != null){
        DbProduct.add({
          id: null,
          name: $scope.data.name,
          description: '',
          category: $scope.data.selectedCategory.rowid,
          menu_category: null
        }).then(function(row){
          DbProduct.getById(row.insertId).then(function(item){
            $scope.products.push(item);
            item['time'] = $scope.data.time;
            item['feeding_time'] = $scope.data.time;
            refill(item);
            $scope.modal.hide();
          });
        });
      }else if($scope.data.selectedProduct != null){

      }
    }
  };

})

.controller('blogsCtrl', function($scope, $state, Blogs, BLOG_FILTER) {
  $scope.filters = BLOG_FILTER;
  $scope.filterBlog = $scope.filters[0];
  $scope.blogs = Blogs.getBlogs($scope.filterBlog);

  $scope.updateBlogs = function(){
    $scope.blogs = Blogs.getBlogs($scope.filterBlog);
  }

  $scope.addBlog = function(){
    $state.go('app.add');
  }
})

.controller('addBlogsCtrl', function($scope, $state, Blogs) {
  $scope.addBlog = function (name, title, text) {
    Blogs.addBlog(name, title, text, $scope.user);
    $state.go('app.blogs');
  };
})

.controller('blogDetailCtrl', function($scope, $ionicActionSheet, $stateParams, Blogs) {
  $scope.blog = Blogs.get($stateParams.blogId);

  $scope.share = function(){

  }

  $scope.removeBlog = function (blogId) {
    Blogs.remove(blogId);
  };
})

.controller('commentsCtrl', function($scope, $state, $stateParams, Blogs) {
  $scope.comments = Blogs.get($stateParams.blogId);

  $scope.addFormComment = function(){
    console.log('tt',  $stateParams.blogId);
    $state.go('app.write', {blogId: $stateParams.blogId});
  }
})

.controller('editBlogCtrl', function($scope, $stateParams, Blogs) {
  $scope.blog = Blogs.get($stateParams.blogId);
})

.controller('commentsWriteCtrl', function($scope, $state, $stateParams, $ionicPopup, Blogs) {
  $scope.blog = Blogs.get($stateParams.blogId);

  $scope.addComment = function (text) {
    /*
    if (!text) {
      var alertPopup = $ionicPopup.alert({
        title: 'Ошибка',
        classCss: 'delete-popup',
        template: 'Данные не введены'
      });
      alertPopup.then(function(res) {
      });
      return false;
    }
    Blogs.addComment(name, text, $stateParams.blogId, $scope.user);
    $scope.blog = Blogs.get($stateParams.blogId);
    $scope.name = undefined;
    $scope.text = undefined;
    */
    $state.go('app.comments', {blogId: $stateParams.blogId});
  };
})

.controller('settingsCtrl', function($scope, $ionicActionSheet) {
  $scope.openShare = function () {
     // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Сообщение' },
        { text: 'Электронная почта' },
        { text: 'Вконтакте' },
        { text: 'Facebook' }
      ],
      titleText: 'Рассказать друзьям',
      cancelText: 'Отмена',
      cancel: function() {
            // add cancel code..
      },
      buttonClicked: function(index) {
         return true;
      }
    });
  };
})

.controller('normalsCtrl', function($scope, $stateParams, DbNorm) {
  $scope.sortOlder = $scope.user.count_month;
  $scope.viewtitle = '<span class="view-title">Нормы</span><span class="view-subtitle">Указаны в граммах в день</span>';

  DbNorm.getNormsForAge($scope.user.count_month).then(function(items){
    $scope.categoryNorm = items;
  });
  $scope.olders = [0,1,2,3,4,5,6,7,8,9,10,11,12];
  $scope.changeOld  = function () {
    DbNorm.getNormsForAge($scope.sortOlder).then(function(items){
      $scope.categoryNorm = items;
    });
  };
})

.controller('changeCtrl', function($scope, $state, EditMode){
  $scope.goTo = function(ind){
    //add flag
    EditMode.mode = true;
    $scope.editMode = true;
    $state.go('master/step_'+ind);
  }

  $scope.reNew = function(){
    EditMode.mode = true;
    EditMode.renew = true;
    $state.go('master/step_6');
  }
})

.controller('calendarCtrl', function($scope, $state){
  $scope.day = moment();
  $scope.month = moment().day(1);

  $scope.changeMonth = function(data){
    $scope.$broadcast('changeMonth', data);
  }
})

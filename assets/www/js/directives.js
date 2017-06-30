angular.module('babytask.directives')

.directive("progressBar", function(){
  return {
    restrict: 'E',
    scope: {
      step: '=',
      totalStep: '='
    },
    link: function(scope, element, attrs) {
      scope.width = (100 * scope.step) / scope.totalStep;
    },
    template: '<div class="linki-progress-bar"><div class="linki-progress" style="width:{{width}}%"></div></div>'
  }
})

.directive("linkiTabs", function(){
  return {
    restrict: 'E',
    scope: {
      'selected':'='
    },
    transclude: true,
    controller: ['$scope', function($scope) {
      var panes = $scope.panes = [];

      $scope.select = function(pane) {
        angular.forEach(panes, function(pane) {
          pane.selected = false;
        });
        pane.selected = true;
      };

      this.addPane = function(pane) {
        if (panes.length === 0) {
          $scope.select(pane);
        }
        panes.push(pane);
      };
    }],
    template:'<div class="linki-tabs" ng-transclude>' +
    '<li ng-repeat="pane in panes" ng-class="{\'active\':selected, \'\':!selected}">'+
    '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
    '</li>' +
    '</div>',
  };
})

.directive("linkiTabItem", function(){
  return {
    require: '^linkiTabs',
    restrict: 'E',
    transclude: true,
    scope: {
      title: '@'
    },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addPane(scope);
    },
    replace: true,
    template: '<div class="linki-tab-item" ng-class="{\'active\':selected, \'\':!selected}">{{title}}</div>'
  }
})

.directive('linkiCalendarAndroid', function($window){
  return {
    restrict: 'E',
    replace: true,
    scope:{
      month: "=",
    },
    link: function($scope, element, attributes){
      $scope.selected = _removeTime($scope.selected || moment());

      var start = $scope.selected.clone();
      start.date(1);
      _removeTime(start.day(0));
      _buildMonth($scope, start, $scope.month);

      console.log(element.children(0).html());
    },
    template: function(element, attributes) {
      var width = $window.innerWidth / 7
      return '<div class="linki-calendar">\
         <a ui-sref="app.main({date:day.str})" ng-repeat="item in days track by $index" \
         ng-style="{\'width\': \''+width+'px\'}"\
         class="day text-center" \
         ng-class="{\'active\': item.isToday, \'hide\': !item.isCurrentMonth}">\
         <div class="day-name">{{item.name}}</div>\
         <div class="day-val">{{item.number}}</div>\
         </a>\
         </div>';
    }
  };
  function _removeTime(date) {
    return date.day(1).hour(0).minute(0).second(0).millisecond(0);
  }
  function _buildWeek(date, month) {
    var days = [];
    var names = [ 'вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб' ];
    for (var i = 0; i < 7; i++) {
      days.push({
        name: names[date.day()],
        number: date.date(),
        str: date.format("YYYY-MM-DD"),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      });
      date = date.clone();
      date.add(1, "d");
    }
    return days;
  }
  function _buildMonth(scope, start, month) {
    days = [];
    var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
    while (!done) {
      days = days.concat(_buildWeek(date.clone(), month));
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
    scope.days = days;
  }
})

.directive("calendar", ['DbRation', '_', function(DbRation, _) {
  return {
    restrict: "E",
    templateUrl: "templates/directive/calendar.html",
    scope: {
      selected: "=",
      month: "=",
    },
    link: function(scope) {
      scope.selected = _removeTime(scope.selected || moment());
      //scope.month = scope.month;

      var statuses = [];
      var start_date = scope.selected.startOf('month');
      var end_date = scope.selected.endOf('month');

      DbRation.getMonth(start_date.format('YYYY-MM-01'),
        end_date.format('YYYY-MM-DD')).then(function(items){
        var tmp = _.filter(items, function(iter){return iter.status != null || iter.is_new == 1;});
        statuses = _.groupBy(tmp, function(it){return it.timer_date});

        var start = scope.selected.clone();
        start.date(1);
        _removeTime(start.day(0));
        _buildMonth(scope, start, scope.month, statuses);
      });

      scope.$on('changeMonth',function(event, data){
        if (data == 'p'){
          scope.previous();
        }else{
          scope.next();
        }
      });
      scope.select = function(day) {
        scope.selected = day.date;
      };
      scope.next = function() {
        var next = scope.month.clone();
        _removeTime(next.month(next.month()+1).date(1));
        scope.month.month(scope.month.month()+1);


        var start_date = scope.month.startOf('month');
        var end_date = scope.month.endOf('month');

        DbRation.getMonth(start_date.format('YYYY-MM-01'),
          end_date.format('YYYY-MM-DD')).then(function(items){
          var tmp = _.filter(items, function(iter){return iter.status != null || iter.is_new == 1;});
          statuses = _.groupBy(tmp, function(it){return it.timer_date});

          _buildMonth(scope, next, scope.month, statuses);
        });
      };

      scope.previous = function() {
        var previous = scope.month.clone();
        _removeTime(previous.month(previous.month()-1).date(1));
        scope.month.month(scope.month.month()-1);

        var start_date = scope.month.startOf('month');
        var end_date = scope.month.endOf('month');

        DbRation.getMonth(start_date.format('YYYY-MM-01'),
          end_date.format('YYYY-MM-DD')).then(function(items){
          var tmp = _.filter(items, function(iter){return iter.status != null || iter.is_new == 1;});
          statuses = _.groupBy(tmp, function(it){return it.timer_date});

          _buildMonth(scope, previous, scope.month, statuses);
        });
      };
    }
  };
  function loadStatus(start){
    var local = start.clone();
  }

  function _removeTime(date) {
    return date.day(1).hour(0).minute(0).second(0).millisecond(0);
  }
  function _buildMonth(scope, start, month, statuses) {
    scope.weeks = [];
    var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
    while (!done) {
      scope.weeks.push({ days: _buildWeek(date.clone(), month, statuses) });
      date.add(1, "w");
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
  }
  function _buildWeek(date, month, statuses) {
    var days = [];
    for (var i = 0; i < 7; i++) {
      var item = {
        name: date.format("dd").substring(0, 1),
        str: date.format("YYYY-MM-DD"),
        number: date.date(),
        isCurrentMonth: date.month() === month.month(),
        isToday: date.isSame(new Date(), "day"),
        date: date
      };

      if(item['str'] in statuses){
        var lst = [];
        _.each(statuses[item['str']], function(item){
          if(item.is_new == 1){
            lst.push(3);
          }else if(item.status == 1){
            lst.push(1);
          }else if(item.status == 2){
            lst.push(2);
          }
        });
        lst = _.uniq(lst);
        if(lst.length > 0){
          console.log(item['str'], lst);
          item['status'] = lst;
        }
      }

      days.push(item);
      date = date.clone();
      date.add(1, "d");
    }
    return days;
  }
}])

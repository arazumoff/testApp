angular.module('babytask.utils')

.service('Utils', ['_', function(_){
  var utils = {
    //Функция получающая час и возвращающая таймстамп с полночи 1970, (учитывает часовой пояс)
    releaseDate : function (hours) {
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
    },

    genDays: function(times){
      var days = {};
      for (var i = 0; i < count; i++) {
        var date = moment().add(i, 'days');
        var times_day = {};
        _.each(times, function(item){
          times_day[item] = [];
        });
        days[date.format('YYYY-MM-DD')] = times_day;
      }
      return days;
    },
    addZero:function(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },

    getDay : function (date, pr) {
      var tomorrow;
      if (pr == 'tm') {
        tomorrow = new Date(date.getTime() + (24 * 60 * 60 * 1000));
      }else {
        tomorrow = new Date(date.getTime() - (24 * 60 * 60 * 1000));
      }
      return tomorrow;
    },

    //Функция получающая кол-во месяцев и возвращающая таймстамп с полночи 1970, (учитывает часовой пояс)
    releaseMon : function (month) {
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
    }
  };
  return utils;
}])

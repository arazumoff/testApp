angular.module('babytask.filters')

.filter('filBlogFunc', function() {
  return function(array, expression) {
    console.log({"array":array, "expression":expression});
    var items = [];
    if (expression.filter == 'date') {
      console.log('123');
      for (var i = 0; i < array.length; i++) {
        console.log(Date.today());
        if (array[i].date == Date.today()) {
          items.push(array[i]);
        }
      }
    }
    return items;
  };
})

.filter('round', function(){
  return function(val){
    return Math.round(val);
  }
})

.filter('ruMonth', function(){
  var lst = ["Января","Февраля","Марта","Апреля","Мая","Июня","Июля","Августа","Сентября","Октября","Ноября","Декабря"];
  return function(val){
    return lst[val-1];
  }
})

.filter('ruMonth2', function(){
  var lst = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
  return function(val){
    return lst[val-1];
  }
})

.filter('floor', function(){
  return function(val){
    return Math.floor(val);
  }
})

.filter('declension', function(){
  function cizz(n,c){
    return c[0]+((/^[0,2-9]?[1]$/.test(n))?c[2]:((/^[0,2-9]?[2-4]$/.test(n))?c[3]:c[1]))
  }
  return function(count, words) {
    var sl = count + ' ' + cizz(count, words);
    return sl;
  }
})

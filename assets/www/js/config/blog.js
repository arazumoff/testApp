angular.module('babytask.config')

  .constant('BLOG_FILTER', [{
    name: 'Последние',
    filter: 'date',
    id: 1
  }, {
    name: 'Популярные',
    filter: 'comments.counts',
    id: 2
  }, {
    name: 'С моими комментариями',
    filter: 'comments.list',
    id: 3
  }])

angular.module('babytask.routes')

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('master/step_1', {
        url: '/master/step_1',
        templateUrl: function() {
          if (ionic.Platform.isAndroid()) {
            return  "templates/android/master_1.html";
          }
          return 'templates/master_1.html';
        },
        controller: 'masterCtrl'
      }
    )
    .state('master/step_2', {
        url: '/master/step_2',
        templateUrl: function() {
          if (ionic.Platform.isAndroid()) {
            return  "templates/android/master_2.html";
          }
          return 'templates/master_2.html';
        },
        controller: 'masterCtrl'
      }
    )
    .state('master/step_3', {
        url: '/master/step_3',
        templateUrl: function() {
          if (ionic.Platform.isAndroid()) {
            return  "templates/android/master_3.html";
          }
          return 'templates/master_3.html';
        },
        controller: 'master3Ctrl'
      }
    )
    .state('master/step_4', {
        url: '/master/step_4',
        templateUrl: function() {
          if (ionic.Platform.isAndroid()) {
            return  "templates/android/master_4.html";
          }
          return 'templates/master_4.html';
        },
        controller: 'masterCtrl'
      }
    )
    .state('master/step_5', {
        url: '/master/step_5',
        templateUrl: function() {
          if (ionic.Platform.isAndroid()) {
            return  "templates/android/master_5.html";
          }
          return 'templates/master_5.html';
        },
        controller: 'master5Ctrl'
      }
    )
    .state('master/step_6', {
        url: '/master/step_6',
        templateUrl: function() {
          if (ionic.Platform.isAndroid()) {
            return  "templates/android/master_6.html";
          }
          return 'templates/master_6.html';
        },
        controller: 'master6Ctrl'
      }
    )
    .state('master/step_7', {
        url: '/master/step_7',
        templateUrl: function() {
          if (ionic.Platform.isAndroid()) {
            return  "templates/android/master_7.html";
          }
          return 'templates/master_7.html';
        },
        controller: 'master7Ctrl'
      }
    )
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: function() {
        if (ionic.Platform.isAndroid()) {
          return  "templates/android/menu.html";
        }
        return 'templates/menu.html';
      },
      controller: 'mainPageCtrl'
    })
    .state('app.blogs', {
      url: '/blogs',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/blogs.html";
            }
            templateUrl: 'templates/blogs.html'
          },
          controller: 'blogsCtrl'
        }
      }
    })
    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/settings.html";
            }
            templateUrl: 'templates/settings.html'
          },
          controller: 'settingsCtrl'
        }
      }
    })
    .state('app.add', {
      url: '/blogs/add',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/addblogs.html";
            }
            templateUrl: 'templates/addblogs.html'
          },
          controller: 'addBlogsCtrl'
        }
      }
    })
    .state('app.blogs-detail', {
      url: '/blogs/:blogId',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/blog-detail.html";
            }
            templateUrl: 'templates/blog-detail.html'
          },
          controller: 'blogDetailCtrl'
        }
      }
    })
    .state('app.edit', {
      url: '/blogs/edit/:blogId',
      views: {
        'menuContent': {
          templateUrl: 'templates/editblog.html',
          controller: 'editBlogCtrl'
        }
      }
    })
    .state('app.comments', {
      url: '/blogs/comments/:blogId',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/comments.html";
            }
            templateUrl: 'templates/comments.html'
          },
          controller: 'commentsCtrl'
        }
      }
    })
    .state('app.write', {
      url: '/blogs/comments/write/:blogId',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/comments_write.html";
            }
            templateUrl: 'templates/comments_write.html'
          },
          controller: 'commentsWriteCtrl'
        }
      }
    })
    .state('app.main', {
      url: '/main?date',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/main.html";
            }
            templateUrl: 'templates/main.html'
          },
          controller: 'mainPageCtrl'
        }
      }
    })
    .state('app.products', {
      url: '/products',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/products.html";
            }
            templateUrl: 'templates/products.html'
          },
          controller: 'productsCtrl'
        }
      }
    })
    .state('app.product-detail', {
      url: '/products/:prodId',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/product-detail.html";
            }
            templateUrl: 'templates/product-detail.html'
          },
          controller: 'productDetailCtrl'
        }
      }
    })
    .state('app.commentprod', {
      url: '/products/:prodId/comment/:normIndex',
      views: {
        'menuContent': {
          templateUrl: 'templates/product-comment.html',
          controller: 'productCommentCtrl'
        }
      }
    })
    .state('app.shopping_list', {
      url: '/shopping',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/shopping_list.html";
            }
            templateUrl: 'templates/shopping_list.html'
          },
          controller: 'shoppingListCtrl'
        }
      }
    })
    .state('app.calendar', {
      url: '/calendar',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/calendar.html";
            }
            templateUrl: 'templates/calendar.html'
          },
          controller: 'calendarCtrl'
        }
      }
    })
    .state('app.change', {
      url: '/change',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/change.html";
            }
            templateUrl: 'templates/change.html'
          },
          controller: 'changeCtrl'
        }
      }
    })
    .state('app.normals', {
      url: '/normals',
      views: {
        'menuContent': {
          templateUrl: function() {
            if (ionic.Platform.isAndroid()) {
              return  "templates/android/normals.html";
            }
            templateUrl: 'templates/normals.html'
          },
          controller: 'normalsCtrl'
        }
      }
    });
  $urlRouterProvider.otherwise('/master/step_1');
});

angular.module('babytask.services')

.factory('Products', ['$http', function($http) {

  var products = DataProduct;

  var category = DataCategory;

  return {
    // получить все категории
    getCat: function() {
      return category;
    },
    // ЭТА ХУЕТА НЕ РАБОТАЕТ!!!!
    getCatByOld: function(old) {
      var tt = [];
      var pp;
      var kl = false;
      for (var i = 0; i < category.length; i++) {
        for (var k = 0; k < category[i].normals.length; k++) {
          if (category[i].normals[k].old == old) {
            pp = category[i].normals[k];
            kl = true;
          }
        }
        if (kl) {
          tt.push({id: category[i].id, name: category[i].name, normals: pp})
        }
      }
      return tt;
    },
    //Принимает id категории и отбирает продукты по данной категории, если категория не указана, возвращает все продукты
    getProd: function(catId) {
      var tt = [];
      if (catId) {
        for (var i = 0; i < products.length; i++) {
          if (products[i].category == catId) {
            tt.push(products[i]);
          }
        }
      }
      else {
        tt = products;
      }
      return tt;
    },
    // получить конкретный продукт по его id
    getProduct: function(id) {
      for (var i = 0; i < products.length; i++) {
        if (products[i].id == id) {
          return products[i];
        }
      }
      return null;
    },
    // ЭТУ ХУЕТУ НАДО ПЕРЕДЕЛАТЬ!!!!
    getProdbyStatus: function(sts) {
      var tt = [];
      var pp = false;
      if (sts == 3) {
        for (var i = 0; i < products.length; i++) {
          for (var k = 0; k < products[i].history.length; k++) {
            if (products[i].history[k].feed) {
              pp = true;
            }
          }
          if (pp) {
            tt.push(products[i]);
            pp = false;
          }
        }
      }
      else {
        for (var i = 0; i < products.length; i++) {
          for (var k = 0; k < products[i].history.length; k++) {
            if (products[i].history[k].status == sts) {
              pp = true;
            }
          }
          if (pp) {
            tt.push(products[i]);
            pp = false;
          }
        }
      }
      return tt;
    },
    // ЭТУ ХУЕТУ НАДО ПЕРЕДЕЛАТЬ!!!!!
    getMonthProd: function(catId, babyOld) {
      var tt = [];
      for (var i = 0; i < products.length; i++) {
        if (products[i].category == catId) {
          if (products[i].recomended_age == babyOld) {
            products[i].added = true;
          }
          tt.push(products[i]);
        }
      }
      return tt;
    }
  };
}])

.factory('Blogs', function() {

  var blogs = [
    {
      id: 1,
      name: 'Прогуляться собираетесь? Вечерок-то будет хорош, только грозы бы вот не было.',
      text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using, making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
      photo: 'img/ben.png',
      author: {
        id: 1,
        sex: undefined,
        files: 'img/ionic.png',
        babyName: 'ВЫ'
      },
      comments: {
        counts: 3,
        list: [
          {
            id: 1,
            user: {
              id: 2,
              sex: undefined,
              files: 'img/ben.png',
              babyName: 'Мама ребенка 2'
            },
            text: 'Коментарий 1, юзера 2 к статье Блог 1',
            date: Date.today()
          },
          {
            id: 2,
            user: {
              id: 3,
              sex: undefined,
              files: 'img/ben.png',
              babyName: 'Мама ребенка 3'
            },
            text: 'Коментарий 2, юзера 3 к статье Блог 1',
            date: Date.today()
          },
          {
            id: 3,
            user: {
              id: 1,
              sex: undefined,
              files: 'img/ionic.png',
              babyName: 'ВЫ'
            },
            text: 'Коментарий 3, юзера 4 к статье Блог 1',
            date: Date.today()
          }
        ]
      },
      date: Date.today()
    },
    {
      id: 2,
      name: 'Ничто так ясно не подтверждает этого…',
      text: 'It is a long established fact that a reader will be  will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
      photo: 'img/perry.png',
      author: {
        id: 3,
        sex: undefined,
        files: 'img/ben.png',
        babyName: 'Мама ребенка 3'
      },
      comments: {
        counts: 2,
        list: [
          {
            id: 1,
            user: {
              id: 3,
              sex: undefined,
              files: 'img/ben.png',
              babyName: 'Мама ребенка 3'
            },
            text: 'Коментарий 1, юзера 3 к статье Блог 2 Прогуляться собираетесь? Вечерок-то будет хорош, только грозы бы вот не было. А впрочем, и лучше, кабы освежило... И вдруг Раскольникову ясно припомнилась вся сцена третьего дня под воротами; он сообразил, что кроме дворников там стояло тогда еще несколько человек, стояли и женщины.',
            date: Date.parse("t - 2 d")
          },
          {
            id: 2,
            user: {
              id: 1,
              sex: undefined,
              files: 'img/ionic.png',
              babyName: 'ВЫ'
            },
            text: 'Прогуляться собираетесь? Вечерок-то будет хорош, только грозы бы вот не было. А впрочем, и лучше, кабы освежило... И вдруг Раскольникову ясно припомнилась вся сцена третьего дня под воротами; он сообразил, что кроме дворников там стояло тогда еще несколько человек, стояли и женщины.',
            date: Date.parse("t - 1 d")
          },
          {
            id: 3,
            user: {
              id: 1,
              sex: undefined,
              files: 'img/ionic.png',
              babyName: 'Трям'
            },
            text: 'Прогуляться собираетесь? Вечерок-то будет хорош, только грозы бы вот не было. А впрочем, и лучше, кабы освежило... И вдруг Раскольникову ясно припомнилась вся сцена третьего дня под воротами; он сообразил, что кроме дворников там стояло тогда еще несколько человек, стояли и женщины.',
            date: Date.parse("t - 1 d")
          }
        ]
        },
      date: Date.parse("t - 3 d")
    },
    {
      id: 3,
      name: 'Блог 3',
      text: 'It is a long established fact that a reader will be look like readable  will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
      photo: 'img/adam.jpg',
      author: {
        id: 2,
        sex: undefined,
        files: 'img/ben.png',
        babyName: 'Мама ребенка 2'
      },
      comments: {
        counts: 1,
        list: [
          {
            id: 1,
            user: {
              id: 1,
              sex: undefined,
              files: 'img/ionic.png',
              babyName: 'ВЫ'
            },
            text: 'Коментарий 1, юзера 1 к статье Блог 3',
            date: Date.parse("t - 4 d")
          },
        ]
      },
      date: Date.parse("t - 5 d")
    }
  ];
  return {
    getBlogs: function(f) {
      var lst = [];
      switch(f.filter){
        case 'date':
          lst = blogs;
          break;
        case 'comments.counts':
          lst = [blogs[0]];
          break;
        case 'comments.list':
          lst = [blogs[1], blogs[2]];
          break;
      }
      return lst;
    },
    get: function(blogId) {
      for (var i = 0; i < blogs.length; i++) {
        if (blogs[i].id === parseInt(blogId)) {
          return blogs[i];
        }
      }
      return null;
    },
    addComment: function (name, text, blogId, user) {
      for (var i = 0; i < blogs.length; i++) {
        if (blogs[i].id == parseInt(blogId)) {
          var idd = blogs[i].comments.list.length + 1
          var coment = {
            id: idd,
            user: {
              id: user.id,
              sex: user.sex,
              files: user.files,
              babyName: name
            },
            text: text,
            date: Date.today()
          };
          blogs[i].comments.counts++;
          blogs[i].comments.list.push(coment);
        }
      }
    },
    addBlog: function (name, title, text, user) {
      var blog = {
        id: blogs.length + 1,
        name: title,
        text: text,
        photo: 'img/adam.jpg',
        author: {
          id: user.id,
          sex: user.sex,
          files: user.files,
          babyName: name
        },
        comments: {
          counts: 0,
          list: []
        },
        date: Date.today()
      };
      blogs.push(blog);
    },
    remove: function (id) {
      for (var i = 0; i < blogs.length; i++) {
        if (blogs[i].id == parseInt(id)) {
          blogs.splice(i, 1);
        }
      }
    }
  };
})
.factory('EditMode', function() {
  return {
    mode : false,
    renew: false
  };
});

var blogControllers = angular.module('blogControllers', ['blogServices']);

blogControllers.controller('loginCtrl', ['$scope', '$rootScope','$http','validator','$location',
  function($scope, $rootScope, $http, validator, $location ) {
    $scope.message = '';
    $scope.messageClass = '';
    $scope.account = '';
    $scope.password = '';
    $scope.login = function() {
      // window.removeEventListener("beforeunload");
      var validateResult = validator.validateLogin({account: $scope.account, password: $scope.password});
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/api/login', {account:$scope.account,password:$scope.password}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            // window.addEventListener("beforeunload", function (e) {
            //   var confirmationMessage = 'Sure to leave?';

            //   (e || window.event).returnValue = confirmationMessage; //Gecko + IE
            //   return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
            // });
            $scope.messageClass = 'success';
            $scope.message = '';
            $rootScope.userData = data.userData;
            if (data.userData.isManager) {
              $location.url('/home/page/1');
            } else {
              $location.url('/user');
              // $location.url('/home/page/1'); // debug use
            }
          }
        });
      }
    }
    // function autoLogin() {
    //   $http.post('/proxy/api/login', {account:'autoLogin',password:'autoLogin'})
    //        .success(function(data) {
    //           if (!data.error) {
    //             $rootScope.userData = data.userData;
    //             if (data.userData.isManager) {
    //               $location.url('/home/page/1');
    //             } else {
    //               $location.url('/user');
    //             }
    //           }
    //        })
    // }
    // autoLogin()
    //*****************************
    // $scope.account = '14331048';
    // $scope.password = '14331048';
    // $scope.login();
    //*****************************
    //*****************************
    // $scope.account = 'manager';
    // $scope.password = 'manager';
    // $scope.login();
    //*****************************
  }]);
blogControllers.controller('registerCtrl', ['$scope','$http','validator',
  function($scope, $http, validator ) {
    $scope.message = '';
    $scope.messageClass = '';
    $scope.account = '';
    $scope.password = '';
    $scope.again = '';
    $scope.name = '';
    $scope.register = function() {
      var validateResult = validator.validateRegister({account: $scope.account, password: $scope.password, name: $scope.name});
      if ($scope.password !== $scope.again) {
        validateResult += '两次输入密码不相同\n';
      }
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/api/register', {account:$scope.account,password:$scope.password,name:$scope.name}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = data.message;
          }
        });
      }
    }
    $scope.superRegister = function() {
      var validateResult = validator.validateRegister({account: $scope.account, password: $scope.password, name: $scope.name});
      if ($scope.password !== $scope.again) {
        validateResult += '两次输入密码不相同\n';
      }
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/Mapi/register', {account:$scope.account,password:$scope.password,name:$scope.name}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = data.message;
          }
        });
      }
    }
  }]);

blogControllers.controller('userCtrl', ['$scope','$http','validator','$rootScope','$location',
  function($scope, $http, validator, $rootScope, $location) {
    if (!$rootScope.userData) {
      $location.url('/login');
    }
    $scope.enterPostDetail = function(postData) {
      $rootScope.postData = postData;
      $location.url('/user/post/'+postData._id);
    }
    $scope.title = ''
    $scope.content = '';
    $scope.message = '';
    $scope.messageClass = '';
    $scope.createPost = function() {
      console.log($scope.message.length);
      var validateResult = validator.validatePost({title: $scope.title, content: $scope.content});
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/api/post', {title: $scope.title, content: $scope.content}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = '';
            $rootScope.userData.posts.unshift(data.postData);
            $scope.title = '';
            $scope.content = '';
          }
        });
      }
    }
  }]);


blogControllers.controller('userPostDetailCtrl', ['$scope','$http','validator','$rootScope','$location','$routeParams',
  function($scope, $http, validator, $rootScope, $location,$routeParams) {
    if (!$rootScope.userData) {
      $location.url('/login');
    }
    $scope.beforeTitle = $rootScope.postData.title;
    $scope.beforeContent = $rootScope.postData.content;
    $scope.content = '';
    $scope.createComment = function () {
      var validateResult = validator.validateComment({content: $scope.content});
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/api/post/'+$routeParams.postId+'/comment', {title: $scope.title, content: $scope.content}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = '';
            $rootScope.postData.comments.push(data.commentData);
            $scope.content = '';
          }
        });
      }
    }
    $scope.editState = false;
    $scope.messageClass = '';
    $scope.message = '';
    $scope.editStateHandler = function() {
      $scope.editState = !$scope.editState;
      $rootScope.postData.title = $scope.beforeTitle;
      $rootScope.postData.content = $scope.beforeContent;

    }
    $scope.editPost = function() {
      var validateResult = validator.validatePost({title: $rootScope.postData.title,content: $rootScope.postData.content});
      if (validateResult) {
        $scope.anotherMessageClass = 'warning';
        $scope.anotherMessage = validateResult;
      } else {
        $http.put('/proxy/api/post/'+$routeParams.postId, {title: $scope.postData.title, content: $scope.postData.content}).success(function(data) {
          if (data.error) {
            $scope.anotherMessageClass = 'warning';
            $scope.anotherMessage = data.message;
          } else {
            $scope.anotherMessageClass = 'success';
            $scope.anotherMessage = '';
            $scope.editState = false;
            $rootScope.postData = data.postData;
            $scope.beforeTitle = $rootScope.postData.title;
            $scope.beforeContent = $rootScope.postData.content;
            var key = null;
              $rootScope.userData.posts.find(function(v,k) {
                if (v._id == $routeParams.postId) {
                  key = k;
                }
              })
              if (key != null) {
                $rootScope.userData.posts.splice(key, 1);
                $rootScope.userData.posts.unshift(data.postData);
              }
          }
        });
      }
    }
    $scope.deletePost= function() {
      if (window.confirm('Sure to delete the Post?')) {
          $http.delete('/proxy/api/post/'+$routeParams.postId).success(function(data) {
            if (data.error) {
              $scope.messageClass = 'warning';
              $scope.message = data.message;
            } else {
              $scope.messageClass = 'success';
              $scope.message = '';
              $scope.editState = false;
              $rootScope.postData = data.postData;
              var key = null;
              $rootScope.userData.posts.find(function(v,k) {
                if (v._id == $routeParams.postId) {
                  key = k;
                }
              })
              if (key != null)
                $rootScope.userData.posts.splice(key, 1);
              $location.url('/user')
            }
        });
      }
    }
  }]);

blogControllers.controller('homeCtrl', ['$scope','$http','validator','$rootScope','$location','$routeParams',
  function($scope, $http, validator, $rootScope, $location,$routeParams) {
    if (!$rootScope.userData) {
      $location.url('/login');
    }

    $scope.queryPosts = function(query) {
      $http.get('/proxy/api/posts?query=' + query).success(function(data) {
        if (data.error) {
          alert(data.message); // modify later
        } else {
          $rootScope.postsData = data.postsData;
          $scope.totalPosts = data.total;
          $scope.postsEachPage = data.eachPage;
          $scope.totalPages = Math.ceil($scope.totalPosts/$scope.postsEachPage);
          $scope.pagesArray = [];
          // for (var i = 1; i <= $scope.totalPages; i++) {
          //   $scope.pagesArray.push(i);
          // }
          $scope.currentPage = $routeParams.page;
          // 10 pages per group
          $scope.totalGroups = Math.ceil($scope.totalPages / 10);
          $scope.currentGroup = Math.ceil($scope.currentPage / 10);
          $scope.prePage = undefined;
          $scope.sufPage = undefined;
          if ($scope.currentGroup > 1) {
            $scope.prePage = ($scope.currentGroup-1)*10;
          }
          if ($scope.currentGroup < $scope.totalGroups) {
            $scope.sufPage = ($scope.currentGroup*10)+1;
          }
          for (var i = ($scope.currentGroup-1)*10+1;i <= $scope.currentGroup*10 && i <= $scope.totalPages; i++) {
            $scope.pagesArray.push(i);
          }
        }
      });
    }
    $scope.queryPosts($routeParams.page);
    $scope.enterPostDetail = function(postData) {
      $rootScope.postData = postData;
      if ($rootScope.userData.isManager) {
        $location.url('/manager/post/'+postData._id);
      } else {
        $location.url('/home/post/'+postData._id);
      }
    }
  }]);

blogControllers.controller('homePostDetailCtrl', ['$scope','$http','validator','$rootScope','$location','$routeParams',
  function($scope, $http, validator, $rootScope, $location, $routeParams) {
    if (!$rootScope.userData) {
      $location.url('/login');
    }
    $scope.content = '';
    $scope.createComment = function () {
      var validateResult = validator.validateComment({content: $scope.content});
      if (validateResult) {
        $scope.messageClass = 'warning';
        $scope.message = validateResult;
      } else {
        $http.post('/proxy/api/post/'+$routeParams.postId+'/comment', {title: $scope.title, content: $scope.content}).success(function(data) {
          if (data.error) {
            $scope.messageClass = 'warning';
            $scope.message = data.message;
          } else {
            $scope.messageClass = 'success';
            $scope.message = '';
            $rootScope.postData.comments.push(data.commentData);
            $scope.content = '';
          }
        });
      }
    }
  }]);

// blogControllers.controller('managerCtrl', ['$scope','$http','validator','$rootScope','$location',
//   function($scope, $http, validator, $rootScope, $location) {
//     if (!$rootScope.userData) {
//       $location.url('/login');
//     }
//     $http.get('/proxy/api/posts').success(function(data) {
//       $rootScope.postsData = data.postsData;
//     });
//     $scope.enterPostDetail = function(postData) {
//       $rootScope.postData = postData;
//       $location.url('/manager/post/'+postData._id);
//     }
//   }]);
blogControllers.controller('managerPostDetailCtrl', ['$scope','$http','validator','$rootScope','$location','$routeParams',
  function($scope, $http, validator, $rootScope, $location, $routeParams) {
    if (!$rootScope.userData) {
      $location.url('/login');
    }
    $scope.postForbiddenSwitch = function() {
      $http.put('/proxy/Mapi/post/'+$routeParams.postId).success(function(data) {
        if (data.error) {
          alert(data.message);
        } else {
          console.log(data);
          // var key = null;
          // $rootScope.postsData.find(function(v,k) {
          //   if (v._id === $routeParams.postId) {
          //     key = k;
          //   }
          // });
          // if (key !== null) {
          //   $rootScope.postsData[key] = data.postData;
          // }
          $rootScope.postData = data.postData;
        }
      });
    }
    $scope.commentForbiddenSwitch = function(commentId) {
      $http.put('/proxy/Mapi/post/'+$routeParams.postId+'/comment/' +commentId).success(function(data) {
        if (data.error) {
          alert(data.message);
        } else {
          // var key = null;
          // $rootScope.postsData.find(function(v,k) {
          //   if (v._id === $routeParams.postId) {
          //     key = k;
          //   }
          // });
          // if (key !== null) {
          //   $rootScope.postsData[key] = data.postData;
          // }
          var key = null;
          $rootScope.postData.comments.find(function(v,k) {
            if (v._id === commentId) {
              key = k;
            }
          });
          if (key !== null) {
            $rootScope.postData.comments[key] = data.commentData;
          }
        }
      });
    }
  }]);
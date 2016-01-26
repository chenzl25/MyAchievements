/* App Module */

var blogApp = angular.module('blogApp', [
  'ngRoute',
  'blogControllers',
  'blogServices',
  'ngAnimate'
  // 'blogAnimations'
]);

blogApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: './partials/login.html',
        controller: 'loginCtrl'
      }).
      when('/register', {
        templateUrl: './partials/register.html',
        controller: 'registerCtrl'
      }).
      when('/user', {
        templateUrl: './partials/user.html',
        controller: 'userCtrl'
      }).
      when('/home/page/:page', {
        templateUrl: './partials/home.html',
        controller: 'homeCtrl'
      }).
      when('/user/post/:postId', {
        templateUrl: './partials/user-post-detail.html',
        controller: 'userPostDetailCtrl'
      }).
      when('/home/post/:postId', {
        templateUrl: './partials/home-post-detail.html',
        controller: 'homePostDetailCtrl'
      }).
      when('/manager', {
        templateUrl: './partials/manager.html',
        controller: 'managerCtrl'
      }).
      when('/manager/post/:postId', {
        templateUrl: './partials/manager-post-detail.html',
        controller: 'managerPostDetailCtrl'
      }).
      otherwise({
        redirectTo: '/login'
      });
  }]);

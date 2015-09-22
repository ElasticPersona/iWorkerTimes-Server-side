var workApp = angular.module('workApp', ['ngResource', 'ngRoute', 'ngTable']);
//var worksCollection = require('../scripts/models/works');
var findAllWorkList = 'https://52.69.128.126:3000/';
var findAllUser = 'https://52.69.128.126:3000/user';

workApp.config(function($locationProvider, $routeProvider) {
  $routeProvider.when('/worklist', {
    templateUrl: '../../views/list.jade', controller: 'ListCtrl'
  }).when('/userlist', {
    templateUrl: '../../views/userlist.jade', controller: 'UserListCtrl'
  }).when('/users/:_id', {
    templateUrl: '../../views/edit.jade', controller: 'EditCtrl'
  }).otherwise({
    redirectTo: '/worklist'
  });
});

workApp.controller('ListCtrl', function($scope, $http, $location) {
  $http.get(findAllWorkList)
  	.success(function(data, status, headers, config) {
	  $scope.data = data.results;
	});
});

workApp.controller('UserListCtrl', function($scope, $http, $location) {
  $http.get(findAllUser)
  	.success(function(data, status, headers, config) {
	  console.log(data.results);
	  $scope.data = data.results;
	});
});

workApp.controller('EditCtrl', function($scope, $routeParams, $location) {
  if ($routeParams._id != 'new') $scope.user = User.get({_id: $routeParams._id});
  $scope.edit = function() {
    User.save($scope.user, function() {
      $location.url('/');
    });
  };
});

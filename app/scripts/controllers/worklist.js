var app = angular.module('app', ['ngResource', 'ngRoute']);
var worksCollection = require('../models/works');

app.config(function($routeProvider) {
  $routeProvider.when('/worklist', {
    templateUrl: '../../views/list.html', controller: 'ListCtrl'
  }).when('/users/:_id', {
    templateUrl: '../../views/edit.html', controller: 'EditCtrl'
  }).otherwise({
    redirectTo: '/worklist'
  });
});

app.controller('ListCtrl', function($scope, $route) {
  $scope.works = worksCollection.query();
  console.log($scope.works);
  //$scope.delete = function(_id) {
  //  User.delete({_id: _id}, function() {
  //    $route.reload();
  //  });
  //};
});

app.controller('EditCtrl', function($scope, $routeParams, $location) {
  if ($routeParams._id != 'new') $scope.user = User.get({_id: $routeParams._id});
  $scope.edit = function() {
    User.save($scope.user, function() {
      $location.url('/');
    });
  };
});

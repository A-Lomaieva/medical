'use strict';

angular.module('Medical')
  .factory('User', function($resource) {
    let resource = $resource(
      '/api/user',
      { id: '@id' },
      {
        login: { method: 'POST', url: '/api/user/login' }
      }
    );
    return new resource;
  })
  .controller('LoginCtrl', ['$scope', 'User', '$location', function ($scope, User, $location) {
    $scope.user = User;
    $scope.login = () => {
      $scope.user.$login().then((data) => {
        if (data.id && data.isAdmin) {
          $location.path('/patient');
        }
      });
    };

    $scope.clear = () => {
      $scope.user.username = '';
      $scope.user.password = '';
    }
  }]);

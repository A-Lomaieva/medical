'use strict';

angular.module('Medical')
  .factory('Patient', function($resource) {
    return $resource(
      '/api/patient/:id',
      { id: '@id' },
      {'query': { method: 'GET' }}
    );
  })
  .controller('PatientCtrl', ['$scope', 'Patient', 'User', '$location', function ($scope, Patient, User, $location) {
    if (!User.isAdmin) {
      // $location.path('/login');
    }
    $scope.items = [];
    $scope.newItem = {};

    $scope.fetch = () => {
      Patient.query((data) => {
        $scope.items = data.items;
      });
    };
    $scope.fetch();

    $scope.add = () => {
      if ($scope.form.$valid) {
        var patient = new Patient($scope.newItem);
        patient.$save(() => {
          $scope.fetch();
          $scope.newItem = {};
        });
      } else {
        alert('Invalid form!');
      }
    };

    $scope.delete = (item) => {
      if (confirm('Are you sure?')) {
        var patient = new Patient(item);
        patient.$delete($scope.fetch);
      }
    }
  }]);

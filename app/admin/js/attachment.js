'use strict';

angular.module('Medical')
  .factory('Attachment', function($resource) {
    return $resource(
      '/api/attachment/:id',
      { id: '@id' },
      {'query': { method: 'GET' }}
    );
  })
  .controller('AttachmentCtrl', ['$scope', 'Patient', 'Attachment', 'User', '$location', '$routeParams', function ($scope, Patient, Attachment, User, $location, $routeParams) {
    if (!User.isAdmin) {
      // $location.path('/login');
    }
    $scope.patientId = $routeParams.id;
    $scope.items = [];
    $scope.newItem = {
      patientId: $scope.patientId
    };

    $scope.fetch = () => {
      Attachment.query({patientId: $routeParams.id}, (data) => {
        $scope.items = data.items;
      });
    };
    $scope.fetch();

    $scope.add = () => {
      if ($scope.form.$valid) {
        var patient = new Attachment($scope.newItem);
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
        var patient = new Attachment(item);
        patient.$delete($scope.fetch);
      }
    }
  }]);

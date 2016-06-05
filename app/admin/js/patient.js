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

    $scope.delete = (item) => {
      if (confirm('Are you sure?')) {
        var patient = new Patient(item);
        patient.$delete($scope.fetch);
      }
    };

    $scope.save = (item) => {
      var patient = new Patient(item);
      patient.$save(() => {
        $scope.fetch();
        if (!item.id) { scope.newItem = {}; }
      });
    };
  }])
  .directive('patientRow', function() {
    return {
      replace: true,
      scope: {
        item: '=patientRow',
        onSave: '=onSave',
        'delete': '=delete'
      },
      template: '<tr ng-form="form" ng-include="isEditting ? \'views/patient-form.html\' : \'views/patient-row.html\'"></tr>',
      link: (scope) => {
        scope.isEditting = !scope.item.id;

        function initForm() {
          scope.changedItem = angular.copy(scope.item);
          scope.changedItem.birthdate = new Date(scope.changedItem.birthdate);
        }

        scope.toggleEdit = () => {
          scope.isEditting = !scope.isEditting;
          if (scope.isEditting) {
            initForm();
          }
        };
      }
    }
  });

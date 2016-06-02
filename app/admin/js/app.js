'use strict';

// Declare app level module which depends on views, and components
angular.module('Medical', [
  'ngResource', 'ngRoute'
]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {

  $routeProvider
    .when('/patient', {
      templateUrl: 'views/patient.html',
      controller: 'PatientCtrl'
    })
    .otherwise({redirectTo: '/patient'});
}]);

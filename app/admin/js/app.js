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
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })
    .otherwise({redirectTo: '/login'});
}]);

'use strict';

/**
 * @ngdoc overview
 * @name archbrowserApp
 * @description
 * # archbrowserApp
 *
 * Main module of the application.
 */
angular
  .module('archbrowserApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

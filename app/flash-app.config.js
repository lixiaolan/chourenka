'use strict';

angular.
  module('flash-app').
  config(['$locationProvider' ,'$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
        
        $routeProvider
            .when('/drill', {
                template: '<drill></drill>'})
            .when('/add', {
                template: '<addchinese></addchinese>'})
            .when('/edit/:cardid', {
                template: '<editcard></editcard>'})
            .otherwise('/drill');}]);

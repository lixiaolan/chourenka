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
            .when('/edit/:infoid', {
                template: '<editinfo></editinfo>'})
            .otherwise('/drill');}]);

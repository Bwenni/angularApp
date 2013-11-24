//Mandates you to write better code that does not throw exceptions.
'use strict';

//Decleration of the application. This is the namespace function. Also includes external libraries in your applications 
var scoreApp = angular.module('scoreApp', ['hmTouchEvents','ng-iscroll','ngProgress']);

//Router, gets the url parameters and directs to the right template and controler.
scoreApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
   delete $httpProvider.defaults.headers.common['X-Requested-With'];
   $routeProvider.
      when('/pools', {templateUrl: 'partials/pools.html', controller: 'PoolCtrl'}).
      when('/schedule', {templateUrl: 'partials/schedule.html', controller: 'ScheduleCtrl'}).
      when('/team/:teamID', {templateUrl: 'partials/team.html',   controller: 'TeamCtrl'}).
      when('/scores/:matchID', {templateUrl: 'partials/scores.html',   controller: 'ScoreCtrl'}).
      when('/addscore/:matchID', {templateUrl: 'partials/addscore.html',   controller: 'ScoreCtrl'}).
      otherwise({redirectTo: '/pools'});
   }]);

//Global variables used in the application
var config = {
    api_url : 'https://api.leaguevine.com/v1/',
    acces_token : 'access_token=0820ecf70',
    tournament_id : '19389',
    tournament_name : 'amsterdam ultimate',
    loader_height : '10px',
    loader_color : 'Navy'
}



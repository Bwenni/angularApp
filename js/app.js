'use strict';

var scoreApp = angular.module('scoreApp', ['angular-gestures']);

(function(){

	scoreApp.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
	  delete $httpProvider.defaults.headers.common['X-Requested-With'];
	  $routeProvider.
	      when('/home', {templateUrl: 'partials/home.html',   controller: 'HomeCtrl'}).
	      when('/pools', {templateUrl: 'partials/pools.html',   controller: 'PoolCtrl'}).
	      when('/schedule', {templateUrl: 'partials/schedule.html',   controller: 'ScheduleCtrl'}).
	      when('/team/:teamID', {templateUrl: 'partials/team.html',   controller: 'TeamCtrl'}).
	      when('/match/:matchID', {templateUrl: 'partials/match.html',   controller: 'MatchCtrl'}).
	      when('/scores/:matchID', {templateUrl: 'partials/scores.html',   controller: 'ScoreCtrl'}).
	      when('/addscore/:matchID', {templateUrl: 'partials/addscore.html',   controller: 'ScoreCtrl'}).
	      otherwise({redirectTo: '/pools'});
	}]);

})();
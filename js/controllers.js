'use strict'; 

/* Controllers */

(function(){ //Begin self invoking anonymous function

	var config = {
		api_url : 'https://api.leaguevine.com/v1/',
		acces_token : 'access_token=0820ecf70',
	    tournament_id : '19389',
	    tournament_name : 'Amsterdam Ultimate'
	}

	var keep = {
		upcoming : false,
		latest : false
	}


	scoreApp.controller('Main', ['$scope', '$location', function ($scope, $location, $routeChangeStart) {
		$scope.menu = 'hide';

		$scope.isActive = function(route) {
			return route === $location.path();
		};

		$scope.header = config.tournament_name;

		$scope.showMenu =  function() {
			if ($scope.menu == 'hide') {
				$scope.menu = 'show';
			} else {
				$scope.menu = 'hide';
			}
		}
	}]);

	scoreApp.controller('HomeCtrl', function ($scope, $http) {
		$scope.filter = 'latest';

		if (keep.latest == false) {
			$scope.displayLoadingIndicator = true;

			$http.get('https://api.leaguevine.com/v1/game_scores/?tournament_id='+config.tournament_id+'&limit=20&'+config.acces_token).success(function(data) {		
				$scope.latest = data.objects;
				console.log($scope.latest);
				$scope.displayLoadingIndicator = false;
				keep.latest = $scope.latest;
			});
		} else {
			$scope.latest = keep.latest;
		}
		if (keep.upcoming == false) {
			$http.get('https://api.leaguevine.com/v1/games/?tournament_id='+config.tournament_id+'&order_by=%5Bstart_time%5D&limit=20&'+config.acces_token).success(function(data) {		
				$scope.upcoming = data.objects;
				console.log($scope.upcoming);
				keep.upcoming = $scope.upcoming;
			});
		} else {
			$scope.upcoming = keep.upcoming;
		}
		$scope.viewOptions = function(ev){
			angular.element(ev.currentTarget).parent().toggleClass('active');
		}	
		$scope.toDate = function(date) {
			var time = new Date(date);
			var day = time.getDay();
			var month = time.getDate();
			var hours = time.getHours();
			var minutes = (time.getMinutes()<10?'0':'') + time.getMinutes();
			return day + '/' + month + ' om ' + hours + ':' + minutes;
		}
	});

	scoreApp.controller('PoolCtrl', function ($scope, $http, $location) {
		$http.get(config.api_url+'pools/?tournament_id='+config.tournament_id+'&limit=30&'+config.acces_token).success(function(data) {
			$scope.pools = data.objects;
		});
		
		$scope.showTeam = function(id) {
			$location.path('/team/'+id);
		}
	});

	scoreApp.controller('ScheduleCtrl', function ($scope, $http, $location) {
		$http.get(config.api_url+'game_scores/?tournament_id='+config.tournament_id+'&order_by=%5Btime%5D&access_token'+config.acces_token).success(function(data) {
			$scope.schedule = data.objects;
			console.log(data.objects);
		});

		$scope.showScore = function(id) {
			$location.path('/scores/'+id);
		}

		$scope.toDate = function(date) {
			var time = new Date(date);
			var day = time.getDate();
			var month = time.getMonth()+1;
			return day + '-' + month;
		}

		$scope.toTime = function(date) {
			var time = new Date(date);
			var hours = time.getHours();
			var minutes = (time.getMinutes()<10?'0':'') + time.getMinutes();
			return hours + ':' + minutes;
		}
	});

	//https://api.leaguevine.com/v1/games/?tournament_id=19389&team_ids=%5B21204%5D&fields=%5Bstart_time%2Cteam_1%2Cteam_2%2Cteam_1_score%2Cteam_2_score%5D&access_token=e12d7b28f4
scoreApp.controller('ScoreCtrl', function ($scope, $http, $location, $routeParams) {
	
	$scope.matchID = $routeParams.matchID;

	$http.get(config.api_url+'game_scores/?game_id='+$scope.matchID+'&fields=%5Bis_final%2Cteam_1%2Cteam_1_score%2Cteam_2%2Cteam_2_score%5D&limit=200&'+config.acces_token).success(function(data) {
		$scope.scores = data.objects;
		console.log($scope.scores);
		
	});

	$scope.submitScore = function() {

		if ($scope.team1score == '' || $scope.team2score == '') {
			alert('Vul alle velden in');
			return false;
		}

		$scope.displayWrapper = false;
		$scope.displayLoadingIndicator = true;

		var postData = {
	      "game_id": $scope.matchID,
		  "team_1_score": $scope.team1score,
          "team_2_score": $scope.team2score,
          "is_final": $scope.isfinal
	    };
	    $http({
	      method: 'POST',
	      url: 'https://api.leaguevine.com/v1/game_scores/',
	      data: postData,
	      headers: {
	      	'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': 'bearer 82996312dc'
	      },
	    }).
	    success(function(response) {
	    	console.log('succes');	
	    	window.location.hash = "/scores/"+$scope.matchID;
	    }).
	    error(function(response) {
	        console.log('failed');	
	    	console.log(response);
	    });
	};
});
//https://api.leaguevine.com/v1/game_scores/?game_id=127153&tournament_id=19389&fields=%5Bis_final%2Cteam_1%2Cteam_1_score%2Cteam_2%2Cteam_2_score%5D&access_token=aa938b6531
	scoreApp.controller('MatchCtrl', function ($scope, $http, $location, $routeParams) {
		$scope.displayWrapper = false;
		$scope.displayLoadingIndicator = true;

		$scope.matchID = $routeParams.matchID;

		$http.get(config.api_url+'games/'+$scope.matchID+'/?'+config.acces_token).success(function(data) {
			$scope.match = data;
			console.log($scope.match);
			$scope.displayLoadingIndicator = false;
			$scope.displayWrapper = true;
		});
	});

	// scoreApp.controller('ScoreCtrl', function ($scope, $http, $location, $routeParams) {
	// 	$scope.displayWrapper = false;
	// 	$scope.displayLoadingIndicator = true;

	// 	$scope.matchID = $routeParams.matchID;

	// 	$http.get(config.api_url+'games/'+$scope.matchID+'/?'+config.acces_token).success(function(data) {
	// 		$scope.match = data;
	// 		console.log($scope.match);
	// 		$scope.displayLoadingIndicator = false;
	// 		$scope.displayWrapper = true;
	// 	});

		
	// });

	scoreApp.controller('TeamCtrl', function ($scope, $http, $routeParams, $location) {
		$scope.teamID = $routeParams.teamID;
		$http.get(config.api_url+'teams/'+$scope.teamID+'/?'+config.acces_token).success(function(data) {
			$scope.team = data;
		});

		$http.get('https://api.leaguevine.com/v1/games/?tournament_id='+config.tournament_id+'&team_ids=['+$scope.teamID+']&'+config.acces_token).success(function(data) {
			$scope.scores = data.objects;
		});

		$scope.showTeam = function(id) {
			$location.path('/team/'+id);
		}

	});


})(); //Eind self invoking anonymous function

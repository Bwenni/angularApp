//Master application controller. 
scoreApp.controller('MainController', function ($scope, $location){
   //Binds active classes to the menu.
   $scope.isActive = function(route) {
      return route === $location.path();
   }
});

//Pool controller. Includes all 
scoreApp.controller('PoolCtrl', function ($scope, $http, $location, ngProgress, updateIscroll, ajaxCall) {
   //Gets the data from the localstorage
    var poolData = JSON.parse(localStorage.getItem('poolData'));

    //Checks if there is any data in the localstorage
    if(poolData){
         //Bind the data to the page
         $scope.pools = poolData.objects;
         updateIscroll($scope, 'pools');
    }else{
        getData();
    }
    //Get new data from the api.
    function getData(){
        //Starts the progressbar.
        progressBarInit(ngProgress);
        //Set the parameters
        var pools_call = 'pools/?tournament_id='+config.tournament_id+'&limit=30&';
       
        var myDataPromise = ajaxCall.getAllData(pools_call, 'poolData');

        myDataPromise.then(function(result) {
            $scope.pools = result.objects;
            ngProgress.complete();
        });

        //Update the iscroll
        updateIscroll($scope, 'pools');
    }
    
    //Refresh button listener.
    $scope.refreshData = function(){
        getData();
    }
    
    //Button listener and directs to another page.
    $scope.showTeam = function(id) {
        $location.path('/team/'+id);
    }

    //Button listener and directs to another page.
    $scope.showSchedule = function(){
        $location.path('/schedule/');
    }

    //When the orientation of the device changes the content changes.
    orientationSwitch();
    function orientationSwitch(){
        switch(window.orientation){  
          case -90:
            $scope.portraitVar = '';
            $scope.$apply()
            break;
          case 90:
              $scope.portraitVar = '';
              $scope.$apply()
              break; 
          case 0:
            $scope.portraitVar = 'portrait';
            $scope.$apply()
            break; 
        }
    }
    window.addEventListener("orientationchange", function() {
        orientationSwitch();
    }, false);

});

//Schedule controller.
scoreApp.controller('ScheduleCtrl', function ($scope, $http, $location, ngProgress, updateIscroll, ajaxCall) {
    var scheduleData = JSON.parse(localStorage.getItem('scheduleData'));
    if(scheduleData){
        $scope.schedule = scheduleData.objects;
        updateIscroll($scope, 'schedule');
    }else{
        getData();
    }
    
    function getData(){
        progressBarInit(ngProgress);

        var schedule_call = 'games/?tournament_id='+config.tournament_id+'&order_by=%5Bstart_time%5D&';
       
        var myDataPromise = ajaxCall.getAllData(schedule_call, 'scheduleData');

        myDataPromise.then(function(result) {
            $scope.schedule = result.objects;
            ngProgress.complete();
        });
        updateIscroll($scope, 'schedule');
    }
    
    $scope.refreshData = function(){
        getData();
    }

    $scope.showPool = function(){
        $location.path('/pools/');
    }

    $scope.showScore = function(id) {
        $location.path('/scores/'+id);
    }

   //Changes the datetime from the api to a readable date
    $scope.toDate = function(date) {
        var time = new Date(date);
        var day = time.getDate();
        var month = time.getMonth()+1;
        return day + '-' + month;
    }

    //Changes the datetime from the api to a readable time
    $scope.toTime = function(date) {
        var time = new Date(date);
        var hours = time.getHours();
        var minutes = (time.getMinutes()<10?'0':'') + time.getMinutes();
        return hours + ':' + minutes;
    }
    
});

//Score controller
scoreApp.controller('ScoreCtrl', function ($scope, $http, $location, $routeParams, ngProgress, updateIscroll, ajaxCall) {
    //Retrieves the id from the url
    $scope.matchID = $routeParams.matchID;

    var scoreData = JSON.parse(localStorage.getItem('scoreData'));
    if(scoreData){
        if(scoreData.game_id === $scope.matchID){
            $scope.scores = scoreData.objects;
            updateIscroll($scope, 'scores');    
        }else{
             getData();
        }
    }else{
        getData();
    }
    

    function getData(){
        progressBarInit(ngProgress);

        var score_call = 'game_scores/?game_id='+$scope.matchID+'&fields=%5Bis_final%2Cteam_1%2Cteam_1_score%2Cteam_2%2Cteam_2_score%5D&limit=200&';

        var myDataPromise = ajaxCall.getAllData(score_call, 'scoreData',$scope.matchID);

        myDataPromise.then(function(result) {
            $scope.scores = result.objects;
            ngProgress.complete();
        });
        updateIscroll($scope, 'scores');
    }
    
    $scope.refreshData = function(){
        getData();
    }

    $scope.showscores = function() {
        $scope.show = 'true';
    };

    $scope.showSchedule = function(){
        $location.path('/schedule/');
    }

    //Toggle function for addscore 
    $scope.custom = true;
    $scope.toggleCustom = function() {
        $scope.custom = $scope.custom === false ? true: false;
         updateIscroll($scope, 'scores');
    };

    //Submit score function
    $scope.submitScore = function() {

        var postData = {
          "game_id": $scope.matchID,
          "team_1_score": $scope.team1score,
          "team_2_score": $scope.team2score,
          "is_final": $scope.isfinal
        };
        //Sets the ajax post call to the api
        $http({
          method: 'POST',
          url: config.api_url+'game_scores/',
          data: postData,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'bearer 82996312dc'
          },
        }).
        success(function(response) {
            console.log('succes');  
            getData();
            updateIscroll($scope, 'scores');
        }).
        error(function(response) {
            console.log('failed');  
        });
    };
});

//Team Controller
scoreApp.controller('TeamCtrl', function ($scope, $http, $routeParams, $location, ngProgress, updateIscroll, ajaxCall) {
    $scope.teamID = $routeParams.teamID;

    getData();

    function getData(){
        progressBarInit(ngProgress);
       
        var teams_call = 'games/?tournament_id='+config.tournament_id+'&team_ids=['+$scope.teamID+']&';
       
        var myDataPromise = ajaxCall.getAllData(teams_call, 'teamData');

        myDataPromise.then(function(result) {
            if(result.objects[0].team_1_id == $scope.teamID){
                $scope.team_name = result.objects[0].team_1.name;
            }else{
                $scope.team_name = result.objects[0].team_2.name;
            }
            $scope.teams = result.objects;
            ngProgress.complete();
            updateIscroll($scope, 'teams');
        });
        
    }
    
    $scope.refreshData = function(){
        getData();
    }

    $scope.showPool = function(){
        $location.path('/pools/');
    }

    $scope.showTeam = function(id) {
        $location.path('/team/'+id);
    }
});
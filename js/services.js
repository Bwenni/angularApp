//Factories are special functions which can be included into the controllers.

//Updates the scroll library to the size of the page.
scoreApp.factory('updateIscroll', function() {
  return function(scope, watch) {
      scope.$watch(watch, function() {
          setTimeout(function () {
              scope.$apply(function () {
                  scope.$parent.myScroll['wrapper'].refresh();
                  scope.$parent.myScroll['wrapper'].scrollToElement("#top");
              });
          }, 1200); //Has to be longer then the duration of the animations.
      });
  };
});

//Recieves all the http parameters and does the ajax calls to the api. Also stores the collected data in the localstorage.
scoreApp.factory('ajaxCall', function ($http, $q) {
  return {
      getAllData: function (call, name, game_id) {
          return $q.all([
              $http.get(config.api_url+call+config.acces_token)
          ]).then(function (result) {
              var aggregatedData = result[0].data;
              if(game_id){
                aggregatedData.game_id = game_id;  
              }
              localStorage.setItem(name, JSON.stringify(aggregatedData));
              return aggregatedData;
          });
      }
  };
});


//Progressbar init function.
var progressBarInit = function(ngProgress){
    ngProgress.height(config.loader_height);
    ngProgress.color(config.loader_color);
    ngProgress.start();
}

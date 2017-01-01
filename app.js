// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

// ROUTES
weatherApp.config(function($routeProvider){
  $routeProvider

    .when('/', {
      templateUrl: 'pages/home.html',
      controller: 'homeController'
    })
    .when('/forecast', {
      templateUrl: 'pages/forecast.html',
      controller: 'forecastController'
    })
});

// SERVICES

weatherApp.service('cityService', function(){
  this.city = 'New york, NY';
});

weatherApp.service('tempScaleService', function(){
  this.scale = 'C'; // 'F' if fahrenheit, 'C' if celsius
});

// CONTROLLERS
weatherApp.controller('scaleController', ['$scope', 'tempScaleService',
  function($scope, tempScaleService){
    $scope.scale = tempScaleService.scale;
    $scope.$watch('scale', function(){
      tempScaleService.scale = $scope.scale;
    });
  }
]);
weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService){
  $scope.city = cityService.city;

  $scope.$watch('city', function(){
    cityService.city = $scope.city;
  });
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', 'cityService' , 'tempScaleService', function($scope, $resource, cityService, tempScaleService){
  $scope.city = cityService.city;
  $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily", {
    callback: "JSON_CALLBACK" }, { get: { method: "JSONP"}});

  $scope.weatherResult = $scope.weatherAPI.get({q: $scope.city, cnt: 2, appid: "8effaed771e1c858d2731846246b3624"});

  $scope.convertToFahrenheit = function(degK){
    return Math.round((1.8 * (degK - 273)) + 32);
  };
  $scope.convertToCelsius = function(degK){
    return Math.round(degK - 273.15);
  };
  $scope.tempScale = tempScaleService;
  // BUG WITH $scope.tempScale = tempScaleService.scale
  // READMORE : http://stackoverflow.com/questions/19744462/update-scope-value-when-service-data-is-changed


}]);
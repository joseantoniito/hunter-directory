var app = angular.module('profile', ['ui.router', 'kendo.directives', 'ui.bootstrap'])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	
    $stateProvider
    .state('override', {
      url: '/override',
      templateUrl: '/override.html',
      controller: 'ProfileCtrl'
    });
    
    $stateProvider
    .state('direccion', {
      url: '/direccion',
      templateUrl: '/direccion.html',
      controller: 'ProfileCtrl'
    });
    
    $stateProvider
    .state('suscripcion', {
      url: '/suscripcion',
      templateUrl: '/suscripcion.html',
      controller: 'ProfileCtrl'
    });
    
    $stateProvider
    .state('user-videos', {
      url: '/user-videos',
      templateUrl: '/user-videos.html',
      controller: 'ProfileCtrl'
    });
    
    
    $stateProvider
    .state('editProfile', {
      url: '/editProfile',
      templateUrl: '/editProfile.html',
      controller: 'ProfileCtrl'
    });
    
    
    $stateProvider
    .state('notificaciones', {
      url: '/notificaciones',
      templateUrl: '/notificaciones.html',
      controller: 'ProfileCtrl'
    });
    
}]);

    app.controller('ProfileCtrl', ['$scope','$state',function($scope, $state){
        
        $scope.menuItemSelected = 0;
        var showMap;
        var showNotfications;
        
        $scope.isMapShow = function() {
            console.log("Is show menu");
            return $scope.menuItemSelected == 1;   
        }
        
        $scope.OnClickMenu = function(value) {
            console.log("Is show men");
        }
        
      
    }]);

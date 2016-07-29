var app = angular.module('profile', ['ui.router', 'kendo.directives', 'ui.bootstrap'])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	
    $stateProvider
    .state('override', {
      url: '/override',
      templateUrl: '/override.html',
      controller: 'ProfileCtrl',
      resolve: {
        postPromise: ['factory', function(factory){
            return factory.obtenerPerfilDistribuidor();
        }]
      }
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

app.controller('NavCtrl', [
'$scope',
'auth',
'factory',
function($scope, auth, factory){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
    
  $scope.distribuidor = factory.distribuidor;
}]);

app.controller('ProfileCtrl', ['$scope','$state','auth','factory',function($scope, $state, auth, factory){
        
    $scope.distribuidor = factory.distribuidor;
    $scope.categorias = factory.categorias;
    $scope.filesLogo = [];
    $scope.filesBanner = [];
    
    if($scope.distribuidor){
        $("#imgDistribuidor")
            .attr("src", "../uploads/" + $scope.distribuidor.logo);
        
        $("#imgBannerDistribuidor")
            .attr("src", "../uploads/" + $scope.distribuidor.banner);
        console.log("distribuidor :");
        console.log($scope.distribuidor);
        
        if($scope.distribuidor.logo)    
            $scope.filesLogo.push({name : $scope.distribuidor.logo, extension: '.' + $scope.distribuidor.logo.split('.')[1]});
        if($scope.distribuidor.banner)
            $scope.filesBanner.push({name : $scope.distribuidor.banner, extension: '.' + $scope.distribuidor.banner.split('.')[1]})
    }

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
        
    $scope.agregarDistribuidor = function(){
        debugger;
        
        //$scope.distribuidor.idCategoria = $scope.distribuidor.idCategoria.id;
        if($scope.filesLogo.length > 0){
            $scope.distribuidor.logo = $scope.filesLogo[0].name;
        }
        if($scope.filesBanner.length > 0){
            $scope.distribuidor.banner = $scope.filesBanner[0].name;
        }
        
        
        factory.agregarDistribuidor($scope.distribuidor)
            .error(function(error){
                debugger;
                $scope.error = error;
            })
            .then(function(){
                alert("Registro actualizado con éxito.")
                //$state.go('home');
            });
    }
    
    $scope.uploadOptions ={
        async: { saveUrl: '/saveFiles', removeUrl: '/removeFiles', autoUpload: true },
        files: $scope.filesLogo,
        success: function(e){
            $scope.filesLogo = e.files;
            
        }
    }
                               
    $scope.uploadOptionsBanner ={
        async: { saveUrl: '/saveFiles', removeUrl: '/removeFiles', autoUpload: true },
        files: $scope.filesBanner,
        success: function(e){
            $scope.filesBanner = e.files;
            
        }
    } 
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};

    auth.saveToken = function (token){
	  $window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function (){
	  return $window.localStorage['flapper-news-token'];
	}

	auth.isLoggedIn = function(){
	  var token = auth.getToken();

	  if(token){
		var payload = JSON.parse($window.atob(token.split('.')[1]));

		return payload.exp > Date.now() / 1000;
	  } else {
		return false;
	  }
	};

	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
		var token = auth.getToken();
		var payload = JSON.parse($window.atob(token.split('.')[1]));

		return payload.username;
	  }
	};

	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){
		auth.saveToken(data.token);
	  });
	};

	auth.logIn = function(user){
	  return $http.post('/login', user).success(function(data){
		auth.saveToken(data.token);
	  });
	};

	auth.logOut = function(){
	  $window.localStorage.removeItem('flapper-news-token');
	  window.location.href = "/#/login";
	};

   
  return auth;
}]);

app.factory('factory', ['$http', 'auth', function($http, auth){
	  var o = {
		distribuidor : null,
        categorias: [
            {id:1, nombre: 'Riego Residencial'},
            {id:2, nombre: 'Riego Institucional'},
            {id:3, nombre: 'Parques y Jardines'},
            {id:4, nombre: 'Distribuidores'},
            {id:5, nombre: 'Punto de venta'},
            {id:6, nombre: 'Equipos y sistemas de Riego'},
            {id:6, nombre: 'Iluminación'},
            {id:7, nombre: 'Distribuidores'},
            {id:8, nombre: 'Golf'},
            {id:9, nombre: 'Riego sintetico'},
            {id:10, nombre: 'Canchas deportivas'},            
            {id:11, nombre: 'Agricola'}  
           
        ],
	  };
  
    
    o.obtenerPerfilDistribuidor = function() {
		return $http.get('/profile/obtenerDistribuidor',{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
		  o.distribuidor = data;
		});
	};
    
    
    o.agregarDistribuidor = function(data) {
		return $http.post('/distribuidores', data)
            .success(function(dataS){
                debugger;
                //o.distribuidores.push(dataS);
            });
	};

    return o;
}]);
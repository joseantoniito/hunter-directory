var app = angular.module('eventos', ['ui.router', 'kendo.directives', 'ui.bootstrap'])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    .state('principal', {
      url: '/principal',
      templateUrl: '/eventos.html',
      controller: 'EventosCtrl',
      resolve: {
        postPromise: ['factory', function(factory){
            debugger;
            return factory.obtenerEventosDeUsuario();
        }]
      }
    });
    
    $stateProvider
    .state('agregar-evento', {
      url: '/agregar-evento',
      templateUrl: '/agregar-evento.html',
      controller: 'EventosCtrl'
    });
    
    
}]);

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);


app.controller('EventosCtrl', [
'$scope',
'$state',
'auth',
'factory',
function($scope, $state, auth, factory){
    $scope.eventos = factory.eventos;
    $scope.evento = factory.evento;
    $scope.files = [];
    
    
    $scope.uploadOptions ={
        async: { saveUrl: 'saveFiles', removeUrl: 'removeFiles', autoUpload: true },
        files: $scope.files,
        success: function(e){
            $scope.files = e.files;

        }
    }
    

    $scope.agregarEvento = function(){
        debugger;

        $scope.evento.banner = $scope.files[0].name;

        factory.agregarEvento($scope.evento)
            .error(function(error){
                $scope.error = error;
            })
            .then(function(){
                $state.go('principal');}
            );
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
}])


app.factory('factory', ['$http', 'auth', function($http, auth){
	  var o = {
		eventos: [],
		categorias: [
            {id:1, nombre: 'Aspersores'},
            {id:2, nombre: 'MP Rotator'},
            {id:3, nombre: 'Toberas'},
            {id:4, nombre: 'Cuerpos de Difusores'},
            {id:5, nombre: 'Riego Localizado'},
            {id:6, nombre: 'Programadores'},
            {id:7, nombre: 'Sensores'},
            {id:8, nombre: 'Controles Remotos'},
        ],
        evento: null
	  };
  
    o.agregarEvento = function(data) {
		return $http.post('/eventos/eventos', data, {headers: {Authorization: 'Bearer '+auth.getToken()}})
            .success(function(dataS){
                debugger;
            });
	};
    o.obtenerEventosDeUsuario = function() {
		return $http.get('/eventos/eventos',{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
            debugger;
		  angular.copy(data, o.eventos);
		});
	};
    
    //código que aun no se ocupa
    o.obtenerDistribuidoresPorCategoria = function(id) {
		return $http.get('/distribuidores/' + id)
            .success(function(dataS){
                angular.copy(dataS, o.distribuidores);
                o.distribuidor = null;
            });
	};
	
    o.obtenerDistribuidor = function(id) {
		return $http.get('/distribuidorPorId/' + id)
            .success(function(dataS){
                o.distribuidor = dataS;
            });
	};
    
    o.obtenerFiltro = function(object, options) {
		return $http.get('/distribuidoresPorNombre/' + options.data.filter.filters[0].value)
            .success(function(dataS){
                options.success(dataS);
            });
    }
  return o;
}]);
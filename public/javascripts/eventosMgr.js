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
    
    $stateProvider
    .state('portafolio-evento', {
      url: '/portafolio-evento/{id}',
      templateUrl: '/portafolio-evento.html',
      controller: 'EventosCtrl',
      resolve: {
        post: ['$stateParams', 'factory', function($stateParams, factory) {
              debugger;
              return factory.obtenerEventoPorId($stateParams.id);
            }]
      }
    });
    
    $stateProvider
    .state('portafolio', {
      url: '/portafolio',
      templateUrl: '/portafolio.html',
      controller: 'EventosCtrl',
      resolve: {
        postPromise: ['factory', function(factory){
            debugger;
            return factory.obtenerEventosCompletos();
        }]
      }
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
    $scope.filesFotos = [];
    
    $scope.sourceEventosCompletos = new kendo.data.DataSource({
        data: factory.eventosCompletos,
        pageSize: 21
    });
    
    if($scope.evento){
        $scope.sourceFotosEvento = new kendo.data.DataSource({
            data: factory.evento.fotos,
            pageSize: 21
        });
    }
    
    
    
    $scope.uploadOptions ={
        async: { saveUrl: 'saveFiles', removeUrl: 'removeFiles', autoUpload: true },
        files: $scope.files,
        success: function(e){
            $scope.files = e.files;

        }
    }
    $scope.uploadOptionsFotos ={
        async: { saveUrl: 'saveFiles', removeUrl: 'removeFiles', autoUpload: true },
        files: $scope.filesFotos,
        success: function(e){
            debugger;
            $scope.filesFotos.push(e.response);
        },
        upload: function(e){
            debugger;
            $scope.filesFotos = [];
        },
        complete: function(e){
            debugger;
            console.log("complete", $scope.filesFotos);
        }
    }
    

    $scope.agregarEvento = function(){
        debugger;

        $scope.evento.banner = $scope.files[0].name;
        $scope.evento.fotos = $scope.filesFotos;

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
        evento: null,
        eventosCompletos: [],
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
    o.obtenerEventoPorId = function(id) {
		return $http.get('/eventos/eventoPorId/' + id).success(function(data){
            debugger;
		    o.evento = data;
		});
	};
    o.obtenerEventosCompletos = function() {
		return $http.get('/eventos/eventosCompletos').success(function(data){
            debugger;
		  angular.copy(data, o.eventosCompletos);
		});
	};
    
    
  return o;
}]);
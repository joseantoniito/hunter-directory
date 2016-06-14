var app = angular.module('realTime', ['ui.router', 'kendo.directives', 'ui.bootstrap'])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home1', {
      url: '/home1',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    });

	$stateProvider
	.state('login', {
	  url: '/login',
	  templateUrl: '/login.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
		if(auth.isLoggedIn()){
		  $state.go('home');
		}
	  }]
	});
	
	$stateProvider
	.state('register', {
	  url: '/register',
	  templateUrl: '/register.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
		if(auth.isLoggedIn()){
		  $state.go('home');
		}
	  }]
	});
	
    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/directorio.html',
      controller: 'MainCtrl'
    });
    
    $stateProvider
    .state('directorio-resultados', {
        url: '/directorio/{id}',
        templateUrl: '/directorio-resultados.html',
        controller: 'MainCtrl',
        resolve: {
            //if($stateParams.id != null)
            post: ['$stateParams', 'projects', function($stateParams, projects) {
              return projects.obtenerDistribuidoresPorCategoria($stateParams.id);
            }]
          }
    });
    
    $stateProvider
    .state('agregar-distribuidores', {
      url: '/agregar-distribuidores',
      templateUrl: '/agregar-distribuidores.html',
      controller: 'MainCtrl'
    });
    
    $stateProvider
    .state('detalle', {
        url: '/detalle/{id}',
        templateUrl: '/detalle.html',
        controller: 'MainCtrl',
        resolve: {
            //if($stateParams.id != null)
            post: ['$stateParams', 'projects', function($stateParams, projects) {
              return projects.obtenerDistribuidor($stateParams.id);
            }]
          }
    });
    
    //$urlRouterProvider.otherwise('home');
}]);


app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}])

app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);

app.controller('MainCtrl', [
'$scope',
'$state',
'auth',
'projects',
function($scope, $state, auth, projects){
    debugger;
    
    $scope.countryNames = [
              "Albania",
              "Andorra",
              "Armenia",
              "Austria",
              "Azerbaijan",
              "Belarus",
              "Belgium",
              "Bosnia & Herzegovina",
              "Bulgaria",
              "Croatia",
              "Cyprus",
              "Czech Republic",
              "Denmark",
              "Estonia",
              "Finland",
              "France",
              "Georgia",
              "Germany",
              "Greece",
              "Hungary",
              "Iceland",
              "Ireland",
              "Italy",
              "Kosovo",
              "Latvia",
              "Liechtenstein",
              "Lithuania",
              "Luxembourg",
              "Macedonia",
              "Malta",
              "Moldova",
              "Monaco",
              "Montenegro",
              "Netherlands",
              "Norway",
              "Poland",
              "Portugal",
              "Romania",
              "Russia",
              "San Marino",
              "Serbia",
              "Slovakia",
              "Slovenia",
              "Spain",
              "Sweden",
              "Switzerland",
              "Turkey",
              "Ukraine",
              "United Kingdom",
              "Vatican City"
                  ];
  
    $scope.products= {
        type: "odata",
        serverFiltering: true,
        transport: {
            read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Products"
        }
    };
    
    $scope.productsDataSource = {
            type: "odata",
            serverFiltering: true,
            transport: {
                read: {
                    url: "http://localhost:3000/distribuidores",
                }
            }
        };
    
    $scope.dataBoundAutoComplete = function(data){
        console.log(data);
    }
    
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slides = [];
    var currIndex = 0;
    
    $scope.addSlide = function() {
        var newWidth = 1300 + slides.length + 1;
        slides.push({
          image: 'http://lorempixel.com/' + newWidth + '/300',
          text: ['Nice image','Awesome photograph','That is so cool','I love that'][slides.length % 4],
          id: currIndex++
        });
      };

    
    for (var i = 0; i < 4; i++) {
        $scope.addSlide();
      }
    
    $scope.currentId = auth.currentId;
    $scope.distribuidores = projects.distribuidores;
    /*$scope.distribuidoresK = new kendo.data.DataSource({ 
     data: projects.distribuidores,
         pageSize: 2
      });*/
    $scope.categorias = projects.categorias;
    $scope.distribuidor = projects.distribuidor;
    
    $scope.agregarDistribuidor = function(){
        debugger;
        projects.agregarDistribuidor($scope.distribuidor)
            .error(function(error){
                $scope.error = error;
            })
            .then(function(){
                $state.go('home');}
            );
    }
    
    $scope.deleteProject = function(id){
	  projects.delete(id).error(function(error){
		$scope.error = error;
		if(!$scope.error.message)
			$scope.error =
				new Object({message:"Ocurrió un error al eliminar el proyecto."});
			
		}).then(function(){
		  //$state.go('proyectos');
		  
		  $scope.error =
				new Object({message:"Proyecto eliminado correctamente."});
		  /*if(data.ok == 1)
				alert("Proyecto eliminado correctamente.");
			else
				alert("Ocurrió un error al eliminar el proyecto.");*/
	  });; 
	};
    
    $scope.successUploadFiles = function(data){
        debugger;  
        console.log(data);
    };
  
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

app.factory('projects', ['$http', 'auth', function($http, auth){
	  var o = {
		distribuidores: [],
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
        distribuidor: null
	  };
  
    o.agregarDistribuidor = function(data) {
		return $http.post('/distribuidores', data)
            .success(function(dataS){
                debugger;
                //o.distribuidores.push(dataS);
            });
	};
    o.obtenerDistribuidoresPorCategoria = function(id) {
		return $http.get('/distribuidores/' + id)
            .success(function(dataS){
                debugger;
                angular.copy(dataS, o.distribuidores);
                o.distribuidor = null;
            });
	};
	
    o.obtenerDistribuidor = function(id) {
		return $http.get('/distribuidorPorId/' + id)
            .success(function(dataS){
                debugger;
                o.distribuidor = dataS;
            });
	};
    
  return o;
}]);
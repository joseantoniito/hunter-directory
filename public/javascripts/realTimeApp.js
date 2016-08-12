var app = angular.module('realTime', ['ui.router', 'kendo.directives', 'ui.bootstrap','ngSanitize','com.2fdevs.videogular'])

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
      controller: 'MainCtrl',
      resolve: {
        post: ['$stateParams', 'projects', function($stateParams, projects) {
            
          projects.obtenerUltimosEventos();
           return  projects.obtenerUltimasNoticias();
        }]
      }
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
    .state('directorio-resultados-texto', {
        url: '/directorio-resultados/{str}',
        templateUrl: '/directorio-resultados.html',
        controller: 'MainCtrl',
        resolve: {
            post: ['$stateParams', 'projects', function($stateParams, projects) {
              return projects.obtenerDistribuidoresPorNombre($stateParams.str);
            }]
          }
    });
    
    $stateProvider
    .state('detalle', {
        url: '/detalle/{id}',
        templateUrl: '/detalle.html',
        controller: 'MainCtrl',
        resolve: {
            //if($stateParams.id != null)
            post: ['$stateParams', 'projects', function($stateParams, projects) {
                projects.obtenerDistribuidoresPorCategoria($stateParams.id);
                projects.obtenerUltimosEventos();
                projects.obtenerUltimasNoticiasDeDistribuidor($stateParams.id);
              return projects.obtenerDistribuidor($stateParams.id);
            }]
          }
    });
    
    $urlRouterProvider.otherwise('home');
}]);


app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.appname = "Riego Sustentable";
  $scope.user = {};
  
    
  $scope.register = function() {
    validateUser($scope.user,registrarUsuario,showError);
  };
    
    var registrarUsuario = function(user)  {
        auth.register(user)
            .error(showError)
            .then( function() {
                    $state.go('home');
                });
    }    

    var showError = function(error) {
          $scope.error = error;
        console.log($scope.error);
    }
    
    var validateUser = function(user, confirm, error) {
        
    if (!user.name) {
        error("El nombre no puede estar vacio");
        return;
    } 
      
    if (!user.password) {
        error("La contrasña no puede estar vacia");
        return;
    } 
      
    if (user.password.length < 5 ) {
        error("La contrasña debe de ser mayor o igual a 5 caracteres");
        return;
    } 
        
    if (!user.email) {
        error("El email no puede estar vacio");
        return;
    }
        
    if (user.email !== user.email_confirm) {
        error("El email es diferente");
        return;
    }
        
    if (!user.tipo) {
        error("Seleccione tipo de usuario");
        return;
    }
            
    confirm(user);
  }    
        

 
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
    
    $scope.categorias = [
            {id:1, nombre: 'Riego Residencial'},
            {id:2, nombre: 'Riego Institucional'},
            {id:3, nombre: 'Parques y Jardines'},
            {id:4, nombre: 'Golf'},
            {id:5, nombre: 'Riego Dintetico'},
            {id:6, nombre: 'Canchas Deportivas'},            
            {id:7, nombre: 'Riego Agricola'}  
           
        ];
          $scope.tipo_industria = [
            {id: 1, nombre: 'Distribuidores'},  
            {id: 2, nombre: 'Punto de venta'},
            {id: 3, nombre: 'Contratista e Instalador'}
          ];
          $scope.iluminacion = [
            {id: 1, nombre: 'FX Iluminación'}  
            
          ];
}]);

app.controller('MainCtrl', [
'$scope',
'$state',
'auth',
'projects',
'$sce',
function($scope, $state, auth, projects, $sce){
    //debugger;
    $scope.appname = "Riego Sustentable";
    $scope.bannerBack = "back.png"
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
    
    
    
    $scope.autoCompleteOptions = {
        //modificación
        dataSource : $scope.productsDataSource,
        dataBound : $scope.dataBoundAutoComplete,
        dataTextField: 'nombre',
        dataValueField: '_id',
        placeholder: "Ej: Riego",
        dataSource: /*$scope.productsDataSource*/ new kendo.data.DataSource({
          serverFiltering: true,
          transport: {
            read: function(options) {
              return projects.obtenerFiltro([], options)

            }
          }
        }),
        select: function(e) {
            console.log(e);
            var item = e.item;
            var text = item.text();
            var id = e.item.data().$$kendoScope.dataItem._id;
            console.log("id",id);
            window.location.href = "/#/detalle/" + id;
          }
      }
    
    $scope.myInterval = 3000;
    $scope.myIntervalSlow = 6000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides = $scope.slidesHome = [
        {
          image: 'http://www.zanita.by/media/files/News/2013/hero_homepage.jpg',
          text: 'Verde',
          desc: 'Espacios verdes, paisajes sonrientes', 
          id: 0
        },
        {
          image: 'https://i.ytimg.com/vi/6OgYgqcwgx8/maxresdefault.jpg',
          desc: 'Una conexiòn verde desde la web',
            text: "Conectate",
          id: 1
        },
        {
          image: 'http://d24i9gy7fiw8h1.cloudfront.net/wp-content/uploads/2014/02/Hunter-4.jpg',
          desc: 'Las mejores herramientas de riego',
          text: 'Crecimiento para tu empresa',
          id: 2
        },
        {
          image: 'http://www.potatogrower.com/Images/gallery/1726_1600.jpg',
          text: 'Asistencia verde en todo momento',
           desc:  'Industria del Riego',
          id: 3
        },
    ];
    
    
    var currIndex = 0;
    
    $scope.currentId = auth.currentId;
    $scope.distribuidores = projects.distribuidores;
    
    $scope.categorias = projects.categorias;
    $scope.tipo_industria = projects.tipo_industria;
    $scope.distribuidor = projects.distribuidor;
    $scope.files = [];
    $scope.categoriaActual = projects.categoriaActual;
    $scope.ultimasNoticias = projects.ultimasNoticias;
    $scope.slides = projects.ultimosEventos;

    $scope.agregarDistribuidor = function(){
        debugger;
        
        $scope.distribuidor.idCategoria = $scope.distribuidor.idCategoria.id;
        $scope.distribuidor.logo = $scope.files[0].name;
        
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
    
    $scope.formatDireccion = projects.formatDireccion;
    
    $scope.changeMaxText = function(texto, maxtext){
        if (texto.length <= maxtext)
            return texto;
        
        return texto.substring(0,maxtext - 3) + "...";
    }
    

    //carousel multi item

    if($state.current.name == "home"){
        debugger;
        var i, first = [],
          second, third;
        var many = 1;

        //##################################################    
        //Need to be changed to update the carousel since the resolution changed
        $scope.displayMode = "tablet";
        //##################################################
        if ($scope.displayMode == "mobile") {many = 3;}
        else if ($scope.displayMode == "tablet") {many = 3;} 
        else {many = 4;}

        for (i = 0; i < $scope.slides.length; i += many) {
            debugger;
          second = {
            image1: $scope.slides[i]
          };
          if (many == 1) {}
          if ($scope.slides[i + 1] && (many == 2 || many == 3)) {
            second.image2 = $scope.slides[i + 1];

          }
          if ($scope.slides[i + (many - 1)] && many == 3) {
            second.image3 = $scope.slides[i + 2];
          }
          first.push(second);
        }
        
        $scope.groupedSlides = first;
    }

    if($state.current.name == "detalle"){
        $scope.slidesdis = [{ 
            image : "../uploads/" + $scope.distribuidor.banner,text: '',
            text: "",
            desc: '', 
            id: 0}];
            
        var arr =    [
            {
              image: 'http://eysh.mx/store/images/promo/0/banner_Conexiones_pagina_web.jpg',
              text: '',
              desc: '', 
              id: 0
            },

           {

              image: 'http://eysh.mx/store/images/promo/0/b2.jpg',
              desc: '',
                text: '',
              id: 1
            },
            {
              image: 'http://eysh.mx/store/images/promo/0/banner_tiendas_pagina_web.jpg',
              desc: '',
              text: '',
              id: 2
            },
            {
              image: 'http://eysh.mx/store/images/promo/0/b1.jpg',
              text: '',
               desc:  '',
              id: 3
            },
        ];


    
     
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(40.0000, -98.0000),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.markerDireccion = {};

        var infoWindow = new google.maps.InfoWindow();

        if($scope.distribuidor.direccion){
            var createMarker = function (info){

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng(info.lat, info.long),
                    title: info.city
                });
                marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

                google.maps.event.addListener(marker, 'click', function(){
                    infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
                    infoWindow.open($scope.map, marker);
                });

                $scope.markerDireccion = marker;

            }  

            createMarker({
                city : 'Riego',
                desc : 'Los mejores sistemas de riego!',
                lat : $scope.distribuidor.direccion.latitud,
                long : $scope.distribuidor.direccion.longitud});

            $scope.openInfoWindow = function(e, selectedMarker){
                e.preventDefault();
                google.maps.event.trigger(selectedMarker, 'click');
            }

            var latLng = new google.maps.LatLng($scope.distribuidor.direccion.latitud, $scope.distribuidor.direccion.longitud);
            $scope.map.setCenter(latLng);
            $scope.map.setZoom(15);

            var oDireccion = $scope.distribuidor.direccion;
            $scope.distribuidor.direccionCompleta = $scope.formatDireccion(oDireccion);
        }
        
        
        
        //videos
        
        $scope.videosDistribuidor = [];
        
        $.each($scope.distribuidor.videos, function(indexE, itemE){
            $scope.videosDistribuidor.push(
                {
                    preload: "none",
                    sources: [
                        {src: $sce.trustAsResourceUrl("/uploads/" + itemE.url), type: "video/" + itemE.url.split('.')[itemE.url.split('.').length-1]},
                    ],
                    tracks: [],
                    theme: {
                        url: "/stylesheets/videogular.css"
                    },id: indexE
                });
        }); 
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

app.factory('projects', ['$http', 'auth', function($http, auth){
	  var o = {
		distribuidores: [],
		categorias: [
            {id:1, nombre: 'Riego Residencial'},
            {id:2, nombre: 'Riego Institucional'},
            {id:3, nombre: 'Parques y Jardines'},
            {id:4, nombre: 'Golf'},
            {id:5, nombre: 'Riego Sintético'},
            {id:6, nombre: 'Canchas Deportivas'},            
            {id:7, nombre: 'Riego Agrícola'}  
           
        ],
          tipo_industria : [
            {id: 1, nombre: 'Distribuidores'},  
            {id: 2, nombre: 'Punto de venta'},
            {id: 3, nombre: 'Master'}
          ],
          iluminacion : [
            {id: 1, nombre: 'Master (Distribuidor/Importador)'},  
            {id: 2, nombre: 'Punto de venta'},
            {id: 3, nombre: 'Contratista e Instadalador'}
          ],
          distribuidor: null,
          ultimosEventos: [],
          categoriaActual : {id:1, nombre: 'Riego Residencial'},
          ultimasNoticias:[] 
	  };
  
    o.formatDireccion = function(oDireccion) {
        if (oDireccion){
          return "{0} {1} -{2}, {3}, {4}, {5} {6}".format(
                        oDireccion.calle || "",
                        oDireccion.numero_exterior || "",
                        oDireccion.numero_interior || "",
                        oDireccion.colonia || "",
                        oDireccion.municipio || "",
                        oDireccion.estado || "",
                        oDireccion.pais || ""
                    );
        }
        return "";
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
            o.categoriaActual =  o.categorias[id - 1];
                angular.copy(dataS, o.distribuidores);
                o.distribuidor = null;
            });
	};
	
    o.obtenerDistribuidoresPorNombre = function(string) {
		return $http.get('/distribuidoresPorNombre/' + string)
            .success(function(dataS){
                angular.copy(dataS, o.distribuidores);
                o.distribuidor = null;
            });
	};
	
    
    o.obtenerDistribuidor = function(id) {
        console.log("holas" + id);
        
		return $http.get('/distribuidorPorId/' + id)
            .success(function(dataS){
            console.log(dataS);    
            o.distribuidor = dataS;
            o.distribuidor.banner = dataS.banner || "back.png";
            o.distribuidor.logo = dataS.logo || "back.png";
            });
	};
    
    o.obtenerFiltro = function(object, options) {
		return $http.get('/distribuidoresPorNombre/' + options.data.filter.filters[0].value)
            .success(function(dataS){
                options.success(dataS);
            });
    }  
    
    o.obtenerUltimosEventos = function(){
        return $http.get('/eventos/obtenerUltimosEventos').success(function(data){
            debugger;
            angular.copy(data, o.ultimosEventos);
		}); 
    }
    
    o.obtenerUltimasNoticias = function(){
        return $http.get('/obtenerUltimasNoticias').success(function(data){
            debugger;
            angular.copy(data, o.ultimasNoticias);
		}); 
    }
        
    o.obtenerUltimasNoticiasDeDistribuidor = function(id){
        return $http.get('/obtenerUltimasNoticias/' + id).success(function(data){
            debugger;
            angular.copy(data, o.ultimasNoticias);
		}); 
        
    }
    
    return o;
}]);
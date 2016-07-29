var app = angular.module('profile', ['ui.router', 'kendo.directives', 'ui.bootstrap'])

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	
    $stateProvider
    .state('distribuidores', {
      url: '/distribuidores',
      templateUrl: '/distribuidores.html',
      controller: 'ProfileCtrl',
      resolve: {
        postPromise: ['factory', function(factory){
            return factory.obtenerDistribuidoresHijos();
        }]
      }
    });
    
    $stateProvider
    .state('agregar-distribuidor', {
      url: '/agregar-distribuidor',
      templateUrl: '/editProfile.html',
      controller: 'ProfileCtrl'
    });

    $stateProvider
    .state('editar-distribuidor', {
      url: '/editar-distribuidor/{id}',
      templateUrl: '/editProfile.html',
      controller: 'ProfileCtrl',
      resolve: {
        post: ['$stateParams', 'factory', function($stateParams, factory) {
              return factory.obtenerDistribuidorPorId($stateParams.id);
            }]
      }
    });
    
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
    .state('editProfile', {
      url: '/editProfile',
      templateUrl: '/editProfile.html',
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
      controller: 'ProfileCtrl',
      resolve: {
        postPromise: ['factory', function(factory){
            return factory.obtenerPerfilDistribuidor();
        }]
      }
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
    
    if($state.current.name == "agregar-distribuidor"){
        debugger;
        $scope.distribuidor = {};
    }
    if($state.current.name == "override"){
        debugger;
        $("#imgDistribuidor")
            .attr("src", "../uploads/" + $scope.distribuidor.logo);
        
        $("#imgBannerDistribuidor")
            .attr("src", "../uploads/" + $scope.distribuidor.banner);

    }
    if($state.current.name == "direccion"){
        //$scope.distribuidor = { direccion:{ calle:"" }};
        
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(40.0000, -98.0000),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        }

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.markerDireccion = {};

        var infoWindow = new google.maps.InfoWindow();

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
            lat : 41.8819,
            long : -87.6278});

        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }
        
        //inicializar componentes de geocodificación con google maps
        var geocoder = new google.maps.Geocoder();
    }
    
    if($scope.distribuidor){
        if($scope.distribuidor.logo)
            $scope.filesLogo.push({name : $scope.distribuidor.logo, extension: '.' + $scope.distribuidor.logo.split('.')[1]});
        if($scope.distribuidor.banner)
            $scope.filesBanner.push({name : $scope.distribuidor.banner, extension: '.' + $scope.distribuidor.banner.split('.')[1]});
        
        $scope.distribuidor.idCategoriaK= {id : $scope.distribuidor.idCategoria};
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
    
    //grid distribuidores hijos
    $scope.distribuidores =  factory.distribuidores;
    $scope.gridOptionsDistribuidores = {
        datasource: $scope.distribuidores, 
        pageable:{pageSize:2, refresh:true, pageSizes:true}, 
        columns:[
			{field:"nombre", title:"nombre"}, 
			{field:"direccion", title:"direccion"},
			{field:"paginaWeb", title:"paginaWeb"},
			{field:"telefono", title:"telefono"},
            {field:"_id", title:"Acciones", width:"100px", 
             template: "<a href='\\#/editar-distribuidor/{{ dataItem._id }}' class='qodef-icon-shortcode normal qodef-icon-little'><i class='qodef-icon-font-awesome fa fa-pencil-square qodef-icon-element'></i></a> <a class='qodef-icon-shortcode normal qodef-icon-little' ng-click='eliminarDistribuidor(dataItem._id)' style='cursor:pointer;'> <i class='qodef-icon-font-awesome fa fa-trash qodef-icon-element'></i> </a>"}
        ]};        
    $scope.eliminarDistribuidor = function(id){
    
    }

    //dirección de distribuidor
    $scope.actualizarDireccionDistribuidor = function(event){
         
         if(!$scope.validator.validate()) return;
        
        if(!$scope.distribuidor.direccion.latitud){
            alert("Debe geolocalizar su dirección y comprobar que sea correcta antes de guardarla.");
            return;
        }
        
         debugger;
        
         factory.actualizarDireccionDistribuidor($scope.distribuidor)
            .error(function(error){
                $scope.error = error;
            })
            .then(function(){
                alert("La dirección fue actualizada con éxito.")
            });
    }

    $scope.geolocalizarDireccion = function(event){
        var oDireccion = $scope.distribuidor.direccion;
        var direccionCompleta = "{0} {1} {2}, {3}, {4}, {5}, {6}".format(
                oDireccion.calle || "",
                oDireccion.numero_exterior || "",
                oDireccion.numero_interior || "",
                oDireccion.colonia || "",
                oDireccion.municipio || "",
                oDireccion.estado || "",
                oDireccion.pais || ""
            );
        
        console.log(direccionCompleta);
        resultsMap = $scope.map;
        address = direccionCompleta;
        
        geocoder.geocode({'address': address}, function(results, status) {
          console.log("results", results);
          console.log("status", status);

          if (status === google.maps.GeocoderStatus.OK) {
              resultsMap.setCenter(results[0].geometry.location);
              var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
              });
              resultsMap.setZoom(15);

              if(status == "OK"){
                $scope.distribuidor.direccion.latitud = results[0].geometry.location.lat();
                $scope.distribuidor.direccion.longitud = results[0].geometry.location.lng();
              }
          } 
          else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
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
            {id:12, nombre: 'Iluminación'},
            {id:7, nombre: 'Distribuidores'},
            {id:8, nombre: 'Golf'},
            {id:9, nombre: 'Riego sintetico'},
            {id:10, nombre: 'Canchas deportivas'},            
            {id:11, nombre: 'Agricola'}  
           
        ],
        distribuidores: []
	  };
    
    o.obtenerPerfilDistribuidor = function() {
		return $http.get('/profile/obtenerDistribuidor',{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
		  o.distribuidor = data;
		});
	};
    
    o.agregarDistribuidor = function(data) {
		return $http.post('/profile/distribuidores', data, {headers: {Authorization: 'Bearer '+auth.getToken()}})
            .success(function(dataS){
                console.log(dataS);
            });
	};
    
     o.obtenerDistribuidoresHijos = function() {
		return $http.get('/profile/obtenerDistribuidoresHijos',{headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
          angular.copy(data, o.distribuidores);
		});
	};
    
    o.obtenerDistribuidorPorId = function(id) {
		return $http.get('/distribuidorPorId/' + id).success(function(data){
		  o.distribuidor = data;
		});
	};
    
    o.actualizarDireccionDistribuidor = function(data) {
		return $http.post('/profile/actualizarDireccionDistribuidor', data, {headers: {Authorization: 'Bearer '+auth.getToken()}})
            .success(function(dataS){
                console.log(dataS);
            });
	};

    return o;
}]);
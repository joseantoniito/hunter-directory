var app = angular.module('eventos', ['ui.router', 'kendo.directives', 'ui.bootstrap', 'angulike'])

app.run([
      '$rootScope', function ($rootScope) {
          $rootScope.facebookAppId = '538366606363211'; // set your facebook app id here
      }
  ]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
    
    
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
'$uibModal',
function($scope, $state, auth, factory, $uibModal){
    $scope.eventos = factory.eventos;
    $scope.evento = factory.evento;
    $scope.filesEvento = [];
    $scope.filesFotosEvento = [];
    var filesBannerEvento = [], filesFotos = [];
    
    if($scope.evento){
        
        $.each($scope.evento.fotos, function(indexE, itemE){
            filesFotos.push({name : itemE.url, extension: '.' + itemE.url.split('.')[1]})
        })
        
        filesBannerEvento.push({name : $scope.evento.banner, extension: '.' + $scope.evento.banner.split('.')[1]});
       
        $scope.evento.fechaInicio = new Date($scope.evento.fechaInicio);
        $scope.evento.fechaFin = new Date($scope.evento.fechaFin);
    }
    
    if($state.current.name == "eventos"){
        $scope.evento = null;
    }
    
    if($state.current.name == "agregar-evento"){
        $scope.evento = {
            nombre: null, 
            descripcion: null,
            direccion: null, 
            fechaInicio: null, 
            fechaFin: null, 
            banner: null,
            fotos: null,
        }
        $scope.filesEvento = [];
        $scope.filesFotosEvento = [];
        $(".k-upload-files").remove();
        $(".k-upload-status").remove();
        $(".k-upload.k-header").addClass("k-upload-empty");
        $(".k-upload-button").removeClass("k-state-focused");

    }
    
    $scope.uploadOptionsBannerEvento ={
        async: { saveUrl: 'saveFiles', removeUrl: 'removeFiles', autoUpload: true },
        files: $scope.filesBannerEvento,
        success: function(e){
            $scope.filesEvento = e.files;
        }
    }
    
    $scope.uploadOptionsFotosEvento ={
        async: { saveUrl: 'saveFiles', removeUrl: 'removeFiles', autoUpload: true },
        files: $scope.filesFotosEvento,
        success: function(e){
            $scope.filesFotosEvento.push(e.response);
        },
        upload: function(e){
            $scope.filesFotosEvento = [];
        },
        complete: function(e){
            console.log("complete", $scope.filesFotosEvento);
        },
        files: filesFotos
    }
    

    $scope.agregarEvento = function(event){
        if(!$scope.validator.validate()) return;
        
        if($scope.files.length == 0){
            alert("El banner es obligatorio.");        
        }
        
        //if(!$scope.evento._id){
            $scope.evento.banner = $scope.files[0].name;
            $scope.evento.fotos = $scope.filesFotosEvento;
        //}

        factory.agregarEvento($scope.evento)
            .error(function(error){
                $scope.error = error;
            })
            .then(function(){
                $state.go('principal');}
            );
    }
    
    $scope.eliminarEvento = function(id){
	  factory.eliminarEvento(id).error(function(error){
          $scope.error = error;
          alert("Ocurrió un error al eliminar el registro.");
          $state.go('principal');
          
		}).then(function(){
          alert("Registro eliminado correctamente.");
          $scope.gridEventos.dataSource.data($scope.eventos);
          $scope.gridEventos.refresh();
	  });; 
	};
   
    
    $scope.gridOptionsEventos = {
        datasource: $scope.eventos, 
        pageable:{pageSize:2, refresh:true, pageSizes:true}, 
        columns:[
			{field:"nombre", title:"nombre"}, 
			{field:"direccion", title:"direccion"},
			{field:"fechaInicio", title:"fechaInicio"},
			{field:"fechaFin", title:"fechaFin"},
            {field:"_id", title:"Acciones", width:"100px", 
             template: "<a href='\\#/agregar-evento/{{ dataItem._id }}' class='qodef-icon-shortcode normal qodef-icon-little'><i class='qodef-icon-font-awesome fa fa-pencil-square qodef-icon-element'></i></a> <a class='qodef-icon-shortcode normal qodef-icon-little' ng-click='eliminarEvento(dataItem._id)' style='cursor:pointer;'> <i class='qodef-icon-font-awesome fa fa-trash qodef-icon-element'></i> </a>"}
        ]};

    $scope.datePickerOptions = {
      parseFormats: ["yyyy-MM-ddTHH:mm:ss"]
    };

}]);

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, id) {
    debugger;
    $scope.items = items;
    $scope.id = id;
    $scope.index = 0;
    
    var foto = $.grep(items, function(item, index){ 
        var ok = item._id == id;
        if(ok)$scope.index = index;
        return ok;
    })[0];
    
    $scope.url = foto.url;
    

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.verFotoAnterior = function(){
        debugger;
        var siguienteFoto = $scope.items[$scope.index - 1];
        if(siguienteFoto){
            $scope.url = siguienteFoto.url;
            $scope.index = $scope.index - 1;
        }
        else{
            $scope.url = $scope.items[$scope.items.length-1].url;
            $scope.index = $scope.items.length-1;
        }    
    }
    
    $scope.verFotoSiguiente = function(){
        debugger;
        var siguienteFoto = $scope.items[$scope.index + 1];
        if(siguienteFoto){
            $scope.url = siguienteFoto.url;
            $scope.index = $scope.index + 1;
        }
        else{
            $scope.url = $scope.items[0].url;
            $scope.index = 0;
        }    
    }
    
    
});

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
		  angular.copy(data, o.eventos);
		});
	};
    o.obtenerEventoPorId = function(id) {
		return $http.get('/eventos/eventoPorId/' + id).success(function(data){
		    o.evento = data;
		});
	};
    
    o.eliminarEvento = function(id) {
		return $http.delete('/eventos/eliminarEvento/' + id, {headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
			console.log(data);
			//todo: checar
			var index;
			for(i=0; i<o.eventos.length; i++){
				if(o.eventos[i]._id == id){
					index = i;
					break;
				}
			};
			o.eventos.splice(index, 1);

		});
	};
    
  return o;
}]);
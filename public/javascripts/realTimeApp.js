var app = angular.module('realTime', ['ui.router', 'kendo.directives', 'ui.bootstrap','ngSanitize','com.2fdevs.videogular', 'angulike'])

app.run([
      '$rootScope', function ($rootScope) {
          $rootScope.facebookAppId = '538366606363211'; // set your facebook app id here
      }
  ]);

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});

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
                projects.obtenerUltimasNoticias();
                projects.obtenerUltimosEventos();
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
                projects.obtenerUltimasNoticias();
                projects.obtenerUltimosEventos();
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
                projects.obtenerUltimasNoticias();
                projects.obtenerUltimosEventos();
                projects.obtenerUltimasNoticiasDeDistribuidor($stateParams.id);
              return projects.obtenerDistribuidor($stateParams.id);
            }]
          }
    });
    
    $stateProvider
    .state('noticias', {
        url: '/noticias',
        templateUrl: '/noticias.html',
        controller: 'MainCtrl',
        resolve: {
            //if($stateParams.id != null)
            post: ['$stateParams', 'projects', function($stateParams, projects) {

              return projects.obtenerUltimasNoticias();
            }]
          }
    });
    
    $stateProvider
    .state('noticia', {
        url: '/noticia/{id}',
        templateUrl: '/noticia.html',
        controller: 'MainCtrl',
        resolve: {
            //if($stateParams.id != null)
            post: ['$stateParams', 'projects', function($stateParams, projects) {
                projects.obtenerUltimosEventos();
                projects.obtenerUltimasNoticias();
                return projects.obtenerNoticiaPorId($stateParams.id);

            }]
          }
    });
    

    $stateProvider
    .state('eventos', {
      url: '/eventos',
      templateUrl: '/portafolio.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['projects', function(projects){
            projects.obtenerUltimasNoticias();
            projects.obtenerUltimosEventos();
            return projects.obtenerEventosCompletos();
        }]
      }
    });
    
    $stateProvider
    .state('evento', {
      url: '/evento/{id}',
      templateUrl: '/portafolio-evento.html',
      controller: 'MainCtrl',
      resolve: {
        post: ['$stateParams', 'projects', function($stateParams, projects) {
            projects.obtenerUltimosEventos();
            projects.obtenerUltimasNoticias();
            return projects.obtenerEventoPorId($stateParams.id);
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

function($scope, $state, auth, projects, $sce, $uibModal){

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
    $scope.noticia = projects.noticia;
    $scope.slides = $scope.ultimosEventos = projects.ultimosEventos;

    $scope.agregarDistribuidor = function() {
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
        
        $scope.descServicios = [
            {
                icono: "fa-briefcase",
                titulo: "Distribuidores a nivel Latino América",
                descripcion: "Los mejores distribuidores latinos estan aqui, si buscas equipo de riego, instalaciones y mantenimientos para todo tipo de área verde."
            },
            {
                icono: "fa-leaf",
                titulo: "Especialistas en todo tipo de riego",
                descripcion: "Se publicitan los expertos en riego riego residencial, institucional, asi como implementaciones en campos de golf, futbol, para todo tipo de instalaciones deportivas."
            },
            {
                icono: "fa-lightbulb-o",
                titulo: "Los mejores sistemas de iluminación",
                descripcion: "Como parte de los desarrollos integrales en instalaciones verdes, es de vital importancia contar con la infraestructura en iluminación mas innovadora para asegurar un espacio ameno y funcional."
            },
            {
                icono: "fa-bullhorn",
                titulo: "Anuncios personalizados y dinámicos",
                descripcion: "Los distribuidores cuentan con la infraestructura para dar a conocer sus servicios cono gran legibilidad y dinamísmo en el sitio."
            }
        ];
        
        $scope.redesSociales = [
            
                {icono: "fa-facebook"},
                {icono: "fa-twitter"},
                {icono: "fa-google-plus"},
                {icono: "fa-tumblr"},
                {icono: "fa-pinterest"}
            
        ];
        
        $scope.contacto = {};

        projects.obtenerDistribuidoresPorCategoria(1).then(function() {

        })
        
        $scope.$on('ngRepeatSlideDistribuidoresFinished', function(ngRepeatFinishedEvent) {
            console.log(jQuery('#corouselDistribuidores.carousel[data-type="multi"] .item'));
            
            jQuery('#corouselDistribuidores.carousel[data-type="multi"] .item').each(function(){
                var next = jQuery(this).next();
                if (!next.length) {
                    next = jQuery(this).siblings(':first');
                }
                next.children(':first-child').clone().appendTo(jQuery(this));

                for (var i=0;i<2;i++) {
                    next=next.next();
                    if (!next.length) {
                        next = jQuery(this).siblings(':first');
                    }
                    next.children(':first-child').clone().appendTo($(this));
                }
            });
            
            $('#corouselDistribuidores.carousel[data-type="multi"]').carousel({ interval: 3000, cycle: true })
        });
        
        $scope.$on('ngRepeatSlideEventosFinished', function(ngRepeatFinishedEvent) {
            console.log(jQuery('#corouselEventos.carousel[data-type="multi"] .item'));
            
            jQuery('#corouselEventos.carousel[data-type="multi"] .item').each(function(){
                var next = jQuery(this).next();
                if (!next.length) {
                    next = jQuery(this).siblings(':first');
                }
                next.children(':first-child').clone().appendTo(jQuery(this));

                for (var i=0;i<2;i++) {
                    next=next.next();
                    if (!next.length) {
                        next = jQuery(this).siblings(':first');
                    }
                    next.children(':first-child').clone().appendTo($(this));
                }
            });
            
            $('#corouselEventos.carousel[data-type="multi"]').carousel({ interval: 3000, cycle: true });
        });
        
        $scope.$on('ngRepeatSlideNoticiasFinished', function(ngRepeatFinishedEvent) {
            console.log(jQuery('#corouselNoticias.carousel[data-type="multi"] .item'));
            
            jQuery('#corouselNoticias.carousel[data-type="multi"] .item').each(function(){
                var next = jQuery(this).next();
                if (!next.length) {
                    next = jQuery(this).siblings(':first');
                }
                next.children(':first-child').clone().appendTo(jQuery(this));

                for (var i=0;i<2;i++) {
                    next=next.next();
                    if (!next.length) {
                        next = jQuery(this).siblings(':first');
                    }
                    next.children(':first-child').clone().appendTo($(this));
                }
            });
            
            $('#corouselNoticias.carousel[data-type="multi"]').carousel({ interval: 3000, cycle: true });
        });
        
        $scope.enviarFormularioContacto = function(){
            if(!$scope.contacto.nombre || !$scope.contacto.email || !$scope.contacto.asunto ){
                alert("Falta información en campos requeridos.");
                return;
            }
            
            projects.enviarFormularioContacto($scope.contacto)
                .error(function(error){
                    debugger;
                    $scope.error = error;
                })
                .then(function(){
                    alert("Mensaje de contacto enviado con éxito.")
                });
        }

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
    
    if($state.current.name == "noticia"){
        
        $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();
            var tamanioContenedor = $("#contenedorNoticia").height()-200;//109 = header
            
            if( 514 < scroll && scroll < tamanioContenedor){
                $("#sideBarFixed").css("position", "fixed");
                $("#sideBarFixed").css("top", "-524px");//514px = header+social+publicidad
            }
            else{
                $("#sideBarFixed").css("position", "static");
            }
        });
        
        $scope.oCompartirFacebookNoticia = {
              Url: 'https://devriego.herokuapp.com',//window.location.href
              Name: 'Riego sustentable',//$scope.evento.nombre, 
              ImageUrl: 'https://devriego.herokuapp.com/uploads/eysh.jpeg'
          };
        
        $("body").addClass("single-post")
        var itemE = $scope.noticia.video;
        $scope.configVideoNoticia =
            {
                preload: "none",
                sources: [
                    {src: $sce.trustAsResourceUrl("/uploads/" + itemE.url), type: "video/" + itemE.url.split('.')[itemE.url.split('.').length-1]},
                ],
                tracks: [],
                theme: {
                    url: "/stylesheets/videogular.css"
                },id: 0
            }   
        
        var imgBanner = document.getElementsByClassName("photo")[0];
        imgBanner.onload = function(){
            var alturaBanner = this.clientHeight;
            var offsetBanner = (alturaBanner - 294)/2;
            this.style.top = "-" + offsetBanner + "px";
        }

    }
    
    if($state.current.name == "eventos"){
        $scope.sourceEventosCompletos = new kendo.data.DataSource({
            data: projects.eventosCompletos,
            pageSize: 21
        });
    }
    
    if($state.current.name == "evento"){
        $scope.evento = projects.evento;
        
        $(window).scroll(function (event) {
            var scroll = $(window).scrollTop();
            var tamanioContenedor = $("#contenedorEvento").height()-200;//109 = header
            
            if( 514 < scroll && scroll < tamanioContenedor){
                $("#sideBarFixed").css("position", "fixed");
                $("#sideBarFixed").css("top", "-524px");//514px = header+social+publicidad
            }
            else{
                $("#sideBarFixed").css("position", "static");
            }
        });
        
        $scope.oCompartirFacebookEvento = {
              Url: 'https://devriego.herokuapp.com',//window.location.href
              Name: 'Riego sustentable',//$scope.evento.nombre, 
              ImageUrl: 'https://devriego.herokuapp.com/uploads/eysh.jpeg'
          };
        
        $scope.sourceFotosEvento = new kendo.data.DataSource({
            data: projects.evento.fotos,
            pageSize: 21
        });
        
        var imgBanner = document.getElementsByClassName("photo")[0];

        imgBanner.onload = function(){
            var alturaBanner = this.clientHeight;
            var offsetBanner = (alturaBanner - 294)/2;
            this.style.top = "-" + offsetBanner + "px";
        }
        
        $scope.verImagenGrande = function (id) {
        
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'myModalContent.html',
              controller: 'ModalInstanceCtrl',
              size: "lg",
              resolve: {
                items: function () {
                  return $scope.evento.fotos;
                }, id : function(){
                    return id;
                }
              }
            });

            modalInstance.result.then(function (selectedItem) {
                  $scope.selected = selectedItem;
                }, function () {
                  console.log('Modal dismissed at: ' + new Date());
                });
              };
        }
    
    
    $scope.generarSlidesBootstrapMulti = function(){
        var i, first = [],
          second, third;
        var many = 1;

        
        /*$scope.displayMode = "tablet";
        if ($scope.displayMode == "mobile") {many = 3;}
        else if ($scope.displayMode == "tablet") {many = 3;} 
        else {many = 4;}*/
        many = 4;

        for (i = 0; i < $scope.slides.length; i += many) {
          second = {
            image1: $scope.slides[i]
          };
          if (many == 1) {}
          if ($scope.slides[i + 1] && (many == 2 || many > 3)) {
              second.image2 = $scope.slides[i + 1];

          }
          else
              second.image2 = {};
            
          if ($scope.slides[i + (many - 2)]  && many > 3) {
              second.image3 = $scope.slides[i + 2];
          }
          else

              second.image3 = {};
            
          if ($scope.slides[i + (many - 1)]  && many > 3) {
              second.image4 = $scope.slides[i + 3];
          }
          else
              second.image4 = {};
            
          first.push(second);
        }
        
        $scope.groupedSlides = first;
        console.log(first);
    }

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

app.factory('projects', ['$http', 'auth', function($http, auth){
	  var o = {
		distribuidores: [],
		categorias: [
            {id:1, nombre: 'Riego Residencial', url:"portfolio1.jpg"},
            {id:2, nombre: 'Riego Institucional', url:"portfolio2.jpg"},
            {id:3, nombre: 'Parques y Jardines', url:"portfolio3.jpg"},
            {id:4, nombre: 'Golf', url:"portfolio4.jpg"},
            {id:5, nombre: 'Riego Sintético', url:"portfolio3.jpg"},
            {id:6, nombre: 'Canchas Deportivas', url:"portfolio2.jpg"},            
            {id:7, nombre: 'Riego Agrícola', url:"portfolio1.jpg"}  
           
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

          ultimasNoticias:[] ,
          eventosCompletos:[],
          evento: null

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
    
    o.enviarFormularioContacto = function(data) {
		return $http.post('/enviarFormularioContacto', data)
            .success(function(dataS){
                console.log(dataS);
            });
	};
    
    o.agregarDistribuidor = function(data) {
		return $http.post('/distribuidores', data)
            .success(function(dataS){
                console.log(dataS);
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
            angular.copy(data, o.ultimosEventos);
		}); 
    }
    
    o.obtenerUltimasNoticias = function(){
        return $http.get('/obtenerUltimasNoticias').success(function(data){
            angular.copy(data, o.ultimasNoticias);
		}); 
    }
        
    o.obtenerUltimasNoticiasDeDistribuidor = function(id){
        return $http.get('/obtenerUltimasNoticias/' + id).success(function(data){
            angular.copy(data, o.ultimasNoticias);
		}); 
        
    }
    
    o.obtenerNoticiaPorId = function(id) {
		return $http.get('/profile/noticiaPorId/' + id).success(function(data){
		  o.noticia = data;
		});
	};
    

    //eventos
    o.obtenerEventosCompletos = function() {
		return $http.get('/eventos/eventosCompletos').success(function(data){
		  angular.copy(data, o.eventosCompletos);
		});
	};
    
    o.obtenerEventoPorId = function(id) {
		return $http.get('/eventos/eventoPorId/' + id).success(function(data){
		    o.evento = data;
		});
	};
    

    return o;
}]);
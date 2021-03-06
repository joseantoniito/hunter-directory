var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');


var Foto = mongoose.model('Foto');
var Noticia = mongoose.model('Noticia');
var Direccion = mongoose.model('Direccion');
var User = mongoose.model('User');
var Distribuidor = mongoose.model('Distribuidor');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var ObjectId = require('mongoose').Types.ObjectId; 


var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var ObjectId = require('mongoose').Types.ObjectId; 

var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/', function(req, res, next) { 
    console.log(req.body);
  res.render('profile', { title: 'Administrar Cuenta' });  
});


router.post('/actualizarVideosDistribuidor', auth, function(req, res, next){
    var objeto = req.body;
    
    Distribuidor.update(
        {_id : new ObjectId(objeto._id)}, 
        {
            videos: objeto.videos
        },  
        function(err, numAffected){
            if(err){ return next(err); }
            return res.json(objeto);
        }
    );
})

router.post('/actualizarDireccionDistribuidor', auth, function(req, res, next){
    
    var dir = req.body.direccion;
    if(!dir.colonia || !dir.calle){
        return res.status(400).json({message: 'Favor de llenar todos los campos.'});
    }
    
    var direccion = new Direccion();
    direccion.calle = dir.calle;
    direccion.numero_interior = dir.numero_interior;
    direccion.numero_exterior = dir.numero_exterior;
    direccion.colonia = dir.colonia;
    direccion.municipio = dir.municipio;
    direccion.estado = dir.estado;
    direccion.pais = dir.pais;
    direccion.entreCalleUno = dir.entreCalleUno;
    direccion.entreCalleDos = dir.entreCalleDos;
    direccion.latitud = dir.latitud;
    direccion.longitud = dir.longitud;
    direccion.codigoPostal = dir.codigoPostal;
    direccion.telefono = dir.telefono;
    direccion.celular = dir.celular;
    direccion.distribuidor = req.body._id;
  
    if(dir._id == null){
        direccion.save(function (err, data){
            if(err){ return next(err); }
            console.log(data);
            Distribuidor.update(
                {_id : new ObjectId(req.body._id)}, 
                {
                    direccion: data._id
                },  
                function(err, numAffected){
                    if(err){ return next(err); }
                    //return res.json(data);
                }
            );
            
            return res.json(data);
        });
    }
    else{
        direccion._id = dir._id;
		Direccion.update(
			{_id : new ObjectId(direccion._id)}, 
			{
				calle : direccion.calle,
                numero_interior : direccion.numero_interior,
                numero_exterior : direccion.numero_exterior,
                colonia: direccion.colonia,
                municipio: direccion.municipio,
                estado : direccion.estado,
                pais : direccion.pais,
                entreCalleUno : direccion.entreCalleUno,
                entreCalleDos : direccion.entreCalleDos,
                latitud : direccion.latitud,
                longitud : direccion.longitud,
                codigoPostal: direccion.codigoPostal,
                telefono: direccion.telefono,
                celular: direccion.celular
			},  
			function(err, numAffected){
				if(err){ return next(err); }
				res.json(direccion);
			}
        );
    }
    
});

router.param('idUser', function(req, res, next, id) {
    console.log(id);
    req.id = id;
    return next();
});

router.get('/userInfo/:idUser', function(req, res, next) {
    console.log("user id connect" +req.id);
    var query = User.findById(req.id);

    query.exec(function (err, data){
        if (err) { console.log(err); return next(err); }
        if (!data) { return next(new Error('No se encuentra el registro.')); }
        console.log(data);

        res.json(data);
    });
});


router.get('/obtenerDistribuidor', auth, function(req, res, next) {
      console.log(req.payload);
	  var query = Distribuidor.find({usuario : new ObjectId(req.payload._id)}).populate('direccion').populate('videos');

	  query.exec(function (err, data){
		if (err) { return next(err); }
		if (data.length == 0) { return next(new Error('No se encuentra el registro.')); }

        console.log(data[0]);
		res.json(data[0]);
	  });
});

router.get('/obtenerDistribuidoresHijos', auth, function(req, res, next) {
      console.log(req.payload);
	  var query = Distribuidor.find({usuarioPadre : new ObjectId(req.payload._id)});//.populate('fotos');

	  query.exec(function (err, data){
		if (err) { return next(err); }
		//if (data.length == 0) { return next(new Error('No se encuentra el registro.')); }

        console.log(data);
		res.json(data);
	  });
});

router.post('/distribuidores', auth, function(req, res, next){
    
    if(!req.body.nombre){
        return res.status(400).json({message: 'Favor de llenar todos los campos.'});
    }

    var distribuidor = new Distribuidor();
    distribuidor.nombre = req.body.nombre;
    distribuidor.descripcion = req.body.descripcion;
    //distribuidor.direccion = req.body.direccion;
    distribuidor.paginaWeb = req.body.paginaWeb;
    distribuidor.idCategoria = req.body.idCategoria;
    distribuidor.logo = req.body.logo;
    distribuidor.banner = req.body.banner;
    distribuidor.usuarioPadre = req.payload._id;
    distribuidor.idTipo = req.body.idTipo;
    
    if(req.body._id == null){
        distribuidor.save(function (err, data){
            if(err){ return next(err); }

            return res.json(data);
        });
    }
    else{
        distribuidor._id = req.body._id;
		Distribuidor.update(
			{_id : new ObjectId(distribuidor._id)}, 
			{
				nombre: distribuidor.nombre,
                descripcion: distribuidor.descripcion,
                //direccion: distribuidor.direccion,
                paginaWeb: distribuidor.paginaWeb,
                idCategoria: distribuidor.idCategoria,
                logo: distribuidor.logo,
                banner: distribuidor.banner,
                idTipo: distribuidor.idTipo
			},  
			function(err, numAffected){
				if(err){ console.log(err); return next(err); }
				res.json(distribuidor);
			}
        );
        
    }
    
});

router.get('/obtenerNoticiasDeDistribuidor/:idUser', auth, function(req, res, next) {
      console.log(req.id);
	  var query = Noticia.find({distribuidor : new ObjectId(req.id)}).populate('video');

	  query.exec(function (err, data){
		if (err) { return next(err); }
		
        console.log(data);
		res.json(data);
	  });
});

router.post('/actualizarNoticiaDistribuidor', auth, function(req, res, next){
    var objeto = req.body;
    if(!objeto.titulo){
        return res.status(400).json({message: 'Favor de llenar todos los campos.'});
    }

    var documento = new Noticia();
    documento.titulo = objeto.titulo;
    documento.contenido = objeto.contenido;
    documento.banner = objeto.banner;
    documento.video = objeto.video;
    documento.distribuidor = objeto.distribuidor;

    
    if(objeto._id == null){
        documento.save(function (err, data){
            if(err){ return next(err); }

            return res.json(data);
        });
    }
    else{
        documento._id = objeto._id;
		Noticia.update(
			{_id : new ObjectId(documento._id)}, 
			{
                titulo: documento.titulo,
                contenido: documento.contenido,
                banner: documento.banner,
                video: documento.video 
			},  
			function(err, numAffected){
				if(err){ console.log(err); return next(err); }
				
                res.json(documento);
			}
        );
        
    }
})

router.get('/noticiaPorId/:idUser', function(req, res, next) {
    var query = Noticia.findById(req.id).populate('video');

    query.exec(function (err, data){
        if (err) { return next(err); }
        if (!data) { return next(new Error('No se encuentra el registro.')); }

        res.json(data);
    });
});


module.exports = router;
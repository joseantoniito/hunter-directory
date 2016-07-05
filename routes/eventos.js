var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');

var Evento = mongoose.model('Evento');
var Foto = mongoose.model('Foto');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var ObjectId = require('mongoose').Types.ObjectId; 

var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


router.get('/', function(req, res, next) {
  res.render('eventos', { title: 'Administrar Eventos' });
});


router.get('/eventos', auth, function(req, res, next) {
      console.log(req.payload);
	  var query = Evento.find({idUsuario : new ObjectId(req.payload._id)});//.populate('fotos');

	  query.exec(function (err, data){
		if (err) { return next(err); }
		if (!data) { return next(new Error('No se encuentra el registro.')); }

        console.log(data);
		res.json(data);
	  });
});

router.get('/obtenerUltimosEventos', function(req, res, next) {
	  var query = Evento.find();//.populate('fotos');

	  query.limit(10).exec(function (err, data){
		if (err) { return next(err); }
		if (!data) { return next(new Error('No se encuentra el registro.')); }

        console.log(data);
		res.json(data);
	  });
});

router.post('/eventos', auth, function(req, res, next){
    console.log(req.body);
    if(!req.body.nombre || !req.body.direccion){
        return res.status(400).json({message: 'Favor de llenar todos los campos.'});
    }

    var objeto = new Evento();
    objeto.nombre = req.body.nombre;
    objeto.descripcion = req.body.descripcion;
    objeto.direccion = req.body.direccion;
    objeto.fechaInicio = req.body.fechaInicio;
    objeto.fechaFin = req.body.fechaFin;
    objeto.banner = req.body.banner;
    objeto.fotos = req.body.fotos;
    objeto.idUsuario = req.payload._id;

    if(req.body._id == null){
        
        objeto.save(function (err, data){
            if(err){ return next(err); }
            console.log(data);
            return res.json(data);
        });
    }
    else{
        objeto._id = req.body._id;
		Evento.update(
			{_id : new ObjectId(objeto._id)}, 
			{
				nombre : objeto.nombre, 
				descripcion : objeto.descripcion, 
				direccion : objeto.direccion,
				fechaInicio : objeto.fechaInicio,
                fechaFin : objeto.fechaFin,
				banner: objeto.banner,
                fotos: objeto.fotos
			},  
			function(err, numAffected){
				if(err){ return next(err); }
				res.json(objeto);
			}
        );
        
    }
    
});


router.param('idEvento', function(req, res, next, id) {
    console.log(id);
    req.id = id;
    return next();
});

router.get('/eventoPorId/:idEvento', function(req, res, next) {
    console.log(req.id);
    var query = Evento.findById(req.id).populate('fotos');

    query.exec(function (err, data){
        if (err) { console.log(err); return next(err); }
        if (!data) { return next(new Error('No se encuentra el registro.')); }
        console.log(data);

        res.json(data);
    });
});

router.delete('/eliminarEvento/:idEvento', auth, function(req, res, next) {
  Evento.remove({_id : new ObjectId(req.id)},
		function(err, data){
		if(err){ return next(err); }

		res.json(data);
	  }
	);
});

router.get('/eventosCompletos', function(req, res, next) {
	  var query = Evento.find().populate('fotos');

	  query.exec(function (err, data){
		if (err) { return next(err); }
		if (!data) { return next(new Error('No se encuentra el registro.')); }

        console.log(data);
		res.json(data);
	  });
});

router.post('/saveFiles',multipartMiddleware, function(req, res, next){
    //console.log(req.files);
    var nombre = req.files.files.originalFilename;
    fs.readFile(req.files.files.path, function (err, data) {
            
        console.log(data);
        fs.writeFile('./public/uploads/' + nombre, data, function (err) {});


        var objeto = new Foto();
        objeto.url = nombre;
        objeto.descripcion = "";

        objeto.save(function (err, dataO){
        if(err){ return next(err); }
            console.log(dataO);
            res.json(dataO);
        });
    });
    
    //res.json(nombre);
});

router.post('/removeFiles', function(req, res, next){
    console.log(req.body);
    
    res.json(req.body);
});

module.exports = router;
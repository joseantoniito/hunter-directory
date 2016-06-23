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
  /*Project.find({ idUsuario: new ObjectId(req.payload._id) },
	  function(err, projects){
		if(err){ return next(err); }

		res.json(projects);
	  });*/
	  
      console.log(req.payload);
	  var query = Evento.find({idUsuario : new ObjectId(req.payload._id)});//.populate('fotos');

	  query.exec(function (err, data){
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

  
    objeto.save(function (err, data){
        if(err){ return next(err); }
        console.log(data);
        return res.json(data);
    });
});


router.post('/saveFiles',multipartMiddleware, function(req, res, next){
    console.log(req.files);
    var nombre = req.files.files.originalFilename;
    fs.readFile(req.files.files.path, function (err, data) {
            
            console.log(data);
           fs.writeFile('./public/uploads/' + nombre, data, function (err) {
          });
         });
    
    res.json(req.files);
});

router.post('/removeFiles', function(req, res, next){
    console.log(req.body);
    
    res.json(req.body);
});

module.exports = router;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');


//var Direccion = mongoose.model('Evento');
//var User = mongoose.model('User');
//var Sucursal = mongoose.model('Sucursal');

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


router.post('/direccion', function(req, res, next){
    
    if(!req.body.colonia || !req.body.calle){
        return res.status(400).json({message: 'Favor de llenar todos los campos.'});
    }
    
    var dir = req.body;
    var direccion = new Direccion();
    direccion.calle = dir.calle;
    direccion.numero_interior = dir.numero_interior;
    direccion.numero_exterior = dir.numero_exterior;
    direccion.pais = dir.pais;
    direccion.estado = dir.estado;
    direccion.municipio = dir.municipio;
    direccion.entreCalleUno = dir.entreCalleUno;
    direccion.entreCalleDos = dir.entreCalleDos;
    direccion.latitud = dir.latitud;
    direccion.longitud = dir.longitud;  
  
    direccion.save(function (err, data){
        if(err){ return next(err); }

        return res.json(data);
    });
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
	  var query = Distribuidor.find({usuario : new ObjectId(req.payload._id)});//.populate('fotos');

	  query.exec(function (err, data){
		if (err) { return next(err); }
		if (data.length == 0) { return next(new Error('No se encuentra el registro.')); }

        console.log(data[0]);
		res.json(data[0]);
	  });
});


module.exports = router;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Distribuidor = mongoose.model('Distribuidor');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var ObjectId = require('mongoose').Types.ObjectId; 

router.get('/profile',function(req, res, next) {
  res.render('profile', { title: 'Administrar Cuenta' });
    
  
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
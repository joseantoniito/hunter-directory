var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Distribuidor = mongoose.model('Distribuidor');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router.get('/home', auth, function(req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log(req);
  console.log(res);
  console.log(next);
  
  res.redirect('/login');
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    debugger;
	if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});


router.get('/categorias', function(req, res, next) {
  Project.find({ privado: false },
	  function(err, projects){
		if(err){ return next(err); }

		res.json(projects);
	  });
});

router.post('/distribuidores', function(req, res, next){
    if(!req.body.nombre || !req.body.direccion){
        return res.status(400).json({message: 'Favor de llenar todos los campos.'});
    }

    var distribuidor = new Distribuidor();
    distribuidor.nombre = req.body.nombre;
    distribuidor.descripcion = req.body.descripcion;
    distribuidor.direccion = req.body.direccion;
    distribuidor.paginaWeb = req.body.paginaWeb;
    distribuidor.idCategoria = req.body.idCategoria;
    
  
    distribuidor.save(function (err, data){
        if(err){ return next(err); }

        return res.json(data);
    });
});

router.param('distribuidor', function(req, res, next, id) {
    Distribuidor.find({ idCategoria: id },
	  function(err, data){
		if(err){ return next(err); }

		req.data = data;
        return next();
	  });
    
    
  });


router.get('/distribuidores/:distribuidor', function(req, res, next) {
    
  res.json(req.data);
});




module.exports = router;

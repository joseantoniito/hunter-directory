var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Distribuidor = mongoose.model('Distribuidor');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var ObjectId = require('mongoose').Types.ObjectId; 
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

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
    console.log(req.body);
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
    req.id = id;
    return next();
  });


router.get('/distribuidores/', function(req, res, next) {
    console.log(req.body);
    Distribuidor.find(
	  function(err, data){
		if(err){ return next(err); }
        
		res.json(data);//{d : { results:data }});
	  });
});

router.get('/distribuidores/:distribuidor', function(req, res, next) {
    Distribuidor.find({ idCategoria: req.id },
	  function(err, data){
		if(err){ return next(err); }

		res.json(data);
	  });
    
});

router.get('/distribuidorPorId/:distribuidor', function(req, res, next) {
    /*Distribuidor.find({ _id: new ObjectId(req.id) },
	  function(err, data){
		if(err){ return next(err); }

		res.json(data);
	  });*/
    
    var query = Distribuidor.findById(req.id);//.populate('colaboradores');

    query.exec(function (err, data){
        if (err) { return next(err); }
        if (!data) { return next(new Error('No se encuentra el registro.')); }

        res.json(data);
    });
});


router.post('/saveFiles',multipartMiddleware, function(req, res, next){
    console.log(req.files);
    //console.log('body: ' + JSON.stringify(req.body));
    //console.log(req.files);
    
    /*var file=req.files.file;
    console.log(file);
    var fs = require('fs');
    fs.writeFile("prueba.png", file, function(err) {
            if(err) {
            return console.log(err);
                }

            console.log("The file was saved!");
        });*/
    var nombre = req.files.files.originalFilename;
    fs.readFile(req.files.files.path, function (err, data) {
            //here get the image name and other data parameters which you are sending like image name etc.
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

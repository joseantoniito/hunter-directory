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
//var paisHelper = require('../helpers/LocalidadHelper');
var userHelper = require('../helpers/UserHelper');

//paisHelper.CrearPaisDefult();

router.get('/home', auth, function(req, res, next) {
  //res.render('index', { title: 'Express' });
  console.log(req);
  console.log(res);
  console.log(next);
  
  res.redirect('/login');
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Imagén Riego' });
});


router.post('/register', function(req, res, next){
    console.log("register:" + req.body.password);
    var body = req.body;
    console.log(req.body);
    /*
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }
  */

   var confirm = function(userBody) {
      
      console.log("confirm Data change" + userBody.password);  
      var user = new User();
      user.username = userBody.username;
      user.name = userBody.name;
      user.email = userBody.email;
      user.dateini = new Date();
      user.lastchange = new Date();
      user.status = {
         state : 10,
         confirm : { state : 10, code: 10, date: new Date()},
         type : 10
      };
       
      user.setPassword(userBody.password);
      user.save(function (err, dataU){
          console.log("usuario guardado");
          console.log(dataU);
            if(err){ 
                console.log("error");
                console.log(err);
                return next(err); 
            }
        
            var distribuidor = new Distribuidor();
            distribuidor.nombre = userBody.name;
            /*distribuidor.descripcion = req.body.descripcion;
            distribuidor.direccion = req.body.direccion;
            distribuidor.paginaWeb = req.body.paginaWeb;*/
            distribuidor.idCategoria = userBody.idCategoria;
            distribuidor.idTipo = userBody.tipo;
            distribuidor.usuario = dataU._id;
            /*distribuidor.logo = req.body.logo;*/


            distribuidor.save(function (err, dataD){
                if(err){ return next(err); }

                //return res.json(dataD);
                return res.json({token: user.generateJWT()})
            });
          
          
        //return res.json({token: user.generateJWT()})
      });
   }
   
   var error = function(error) {
       console.log("error user helper");
       console.log("error")
       return res.status(400).json({message: error});
   }
    
  userHelper.isUserValid(body, confirm, error);
  
  /*
 
  */
    
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
    distribuidor.logo = req.body.logo;
    distribuidor.banner = req.body.banner;
    
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
                direccion: distribuidor.direccion,
                paginaWeb: distribuidor.paginaWeb,
                idCategoria: distribuidor.idCategoria,
                logo: distribuidor.logo,
                banner: distribuidor.banner

			},  
			function(err, numAffected){
				if(err){ console.log(err); return next(err); }
				res.json(distribuidor);
			}
        );
        
    }
    
});

router.param('distribuidor', function(req, res, next, id) {
    req.id = id;
    return next();
  });


router.get('/distribuidoresPorNombre/:distribuidor', function(req, res, next) {
    console.log(req.id);
    var r = new RegExp(req.id,'i');
    Distribuidor.find({ nombre: {$regex:r} },
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

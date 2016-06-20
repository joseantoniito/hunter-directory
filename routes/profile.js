var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');


router.get('/profile',function(req, res, next) {
  res.render('profile', { title: 'Administrar Cuenta' });
    
  
});


module.exports = router;
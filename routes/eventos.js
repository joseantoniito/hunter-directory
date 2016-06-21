var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');


router.get('/', function(req, res, next) {
  res.render('eventos', { title: 'Administrar Eventos' });
});


module.exports = router;
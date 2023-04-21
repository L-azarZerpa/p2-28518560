var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'nombre: eleazar zerpa, cedula:28.518.560, seccion:2' });
});

module.exports = router;  

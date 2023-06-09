require('dotenv').config()
require('ejs')
var express = require('express');
const db = require('../database');
var router = express.Router();
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
var request = require('request');
const ua = require('universal-analytics');

const visitor = ua('process.env.UA_GA');
const ua2 = process.env.UA_GA2
const myKey = process.env.MY_KEY

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Eleazar Zerpa,28 518 560, seccion 3',myKey:myKey,ua2:ua2 });
});

visitor.pageview('/page1').send();
visitor.event('Category', 'Action', 'Label', 42).send();

router.post('/', async function(req, res, next) {
  let  name = req.body.name;
  let  email = req.body.email;
  let comment = req.body.comment;
  let date = Date();
  let country;
  let ip = req.headers['x-forwarded-for'] ||  req.socket.remoteAddress;
  const myIP = ip.split(',')[0];
  try {
    const url = 'http://api.ipstack.com/' + myIP + '?access_key=470211dbb6394999a95614fd5799d524';
    const response2 = await fetch(url);
    const data2 = await response2.json();
    country = data2.country_name;
    


    emailSubmit = async () => {
      const config = {
          host : 'smtp.gmail.com',
          port : 587,
          auth : {
              user : process.env.USER_EMAIL,
    
              pass : process.env.PASS_EMAIL
          }
      }
      
  
      const mensaje = {
          from : process.env.USER_EMAIL,
          to : process.env.TO_EMAIL,
          subject : 'p2_formulario',
          text : ' nombre: ' + name + ' comentario: ' + comment + ' email: ' + email + ' fecha: ' + date + ' la ip: ' + myIP + ' el pais es: ' + country
      }
      const transport = nodemailer.createTransport(config);
      const info = await transport.sendMail(mensaje);
      
      console.log(info);
  } 
  
  emailSubmit();

  db.insert(name, email, comment, date, myIP, country);
    res.redirect('/');
  } catch (error) {
    console.error(error);
  }
})

router.get('/contactos', function(req, res, next) {
  db.select(function (rows) {
    res.render('contactos', { title: 'Registros del formulario',rows: rows,myKey:myKey,ua2:ua2 });
  });
});
z

module.exports = router;
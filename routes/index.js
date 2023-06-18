require('dotenv').config()
require('ejs')
var express = require('express');
const db = require('../database');
var router = express.Router();
const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
var request = require('request');
const ua = require('universal-analytics');

















const ic = process.env.ID_CLIENT2
const {OAuth2Client} = require('google-auth-library')
const client = new OAuth2Client(process.env.ID_CLIENT);
async function getEmail(datos) {
  // Verificar el token JWT y obtener la información del usuario
  const ticket = await client.verifyIdToken({
    idToken: datos.credential,
    audience: process.env.ID_CLIENT
  });
  // Obtener un objeto con la información del usuario
  const user = ticket.getPayload();
  // Obtener el email del usuario
  const email = user.email;
  // Devolver el email
  return email;
}
router.post('/logueo', function(req, res, next){
  const datos = req.body;
  // Llamar a la función getEmail() para obtener el email del usuario
  getEmail(datos).then(email => {
    if (email == process.env.EMAIL_GOOGLE) {
      db.select(function (rows) {
        res.render('contactos', { title: 'Registros del formulario',rows: rows,myKey:myKey,ua2:ua2 });
      });
    } else {
      res.status(500).send("Error al verificar el token, No eres un usuario autorizado");
    }
    
  })
})
















const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy


router.use(express.urlencoded({extended:true}));

router.use(cookieParser('mi'));

router.use(session({
    secret:'mi',
    resave:true,
    saveUninitialized:true
}));

router.use(passport.initialize());
router.use(passport.session());




passport.use(new PassportLocal(function(username,password,done){
    if (username === process.env.USER_NAME && password === process.env.PASSWORD) 
    return done(null,{id:1,name:"cody"})
    done(null,false)
}))

passport.serializeUser(function (user,done) {
 done(null,user.id)   
})

passport.deserializeUser(function (id,done) {
  done(null,{id:1,name:"cody"})  
})
router.get('/contactos',(req,res,next)=>{
  if(req.isAuthenticated()) return next();

  res.redirect("/login")
},(req, res) => {
  db.select(function (rows) {
    res.render('contactos', { title: 'Registros del formulario',rows: rows,myKey:myKey,ua2:ua2 });
  });
});

router.get("/login",(req,res)=>{
  res.render('login', { title: 'login',myKey:myKey,ua2:ua2,ic:ic });
})

router.post("/login",passport.authenticate('local',{
  successRedirect:"/contactos",
  failureRedirect:"/login"
}))





















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
  let country ="W";
  let ip = req.headers['x-forwarded-for'] ||  req.socket.remoteAddress;
  const myIP = ip.split(",")[0];
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
              user : process.env.USER,
    
              pass : process.env.PASS
          }
      }
      
  
      const mensaje = {
          from : process.env.USER,
          to : process.env.TO,
          subject : 'formulario programacion2',
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






module.exports = router;
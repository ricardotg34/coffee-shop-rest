const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')
const app = express()

app.post('/login',(req, res)=>{

  let body = req.body;
  //Realizar el inicio de sesion
  Usuario.findOne({email: body.email},(err,usuarioDB)=>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }
    if (!usuarioDB) { //Si no existe el usuario en la base de datos regresa un error
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o contrasena incorrectos"
        }
      })
    }
    if (!bcrypt.compareSync(body.password, usuarioDB.password)){ //Si la contraseña no coincide, regresa un error
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o contrasena incorrectos"
        }
      })
    }
    //Si se ingreso el usuario y la contraseña correcta, pasa a retornar en la respuesta al usuario y a su token de acceso
    let token = jwt.sign({
      usuario: usuarioDB
    },process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});
    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    });
  });
})

module.exports = app
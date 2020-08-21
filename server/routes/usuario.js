const express = require('express')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
const { verifyToken, verifyAdminToken } = require('../middlewares/authentication')
const app = express()


//Obtener datos de todos los usuarios
app.get('/usuario', [verifyToken, verifyAdminToken], (req, res) =>{
  // Si existe en los parametros de la url se toma ese valor, si no se toma el valor de 0
  //Indica desde que registro deseamos leer
  let from = req.query.from || 0
  from = Number(from)
  // Si existe en los parametros de la url se toma ese valor, si no se toma el valor de 5
  //Indica cuantos registros queremos que devuelva la respuesta
  let limit = req.query.limit || 5
  limit = Number(limit)
  Usuario.find({estado:true},'nombre email img role').skip(from).limit(limit).exec((err,usuarios)=>{
    if (err) {
      res.status(400).json({
        ok:false,
        err
      })
    }
    else {
      Usuario.count({estado:true},(err,count)=>{
        res.json({
          ok:true,
          usuarios,
          count
        })
      })
    }
  })
})
//Crear un nuevo registro
app.post('/usuario', [verifyToken, verifyAdminToken], (req, res) =>{
  let body = req.body
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  })

  usuario.save((err,usuarioDB)=>{
    if (err) {
      res.status(400).json({
        ok:false,
        err
      })
    }
    else {
      res.json({
        ok:true,
        usuario: usuarioDB
      })
    }
  })
});
//Actualizar datos
app.put('/usuario/:id', [verifyToken, verifyAdminToken], (req, res) =>{
  let id = req.params.id
  let body = req.body
  Usuario.findByIdAndUpdate(
    id,
    body,
    {
      new: true, //Para que en la respuesta regrese el usuario modificado
      runValidators: true //Valida la info con base en el esquema
    },
    (err,usuarioDB)=>{
    if (err) {
      res.status(400).json({
        ok:false,
        err
      })
    }
    else {
      res.json({
        ok:true,
        usuario: usuarioDB
      })
    }
  })
});
//Borrar datos
app.delete('/usuario/:id', [verifyToken, verifyAdminToken], (req, res) =>{
  let id = req.params.id
  //Realmente modifica el estado de activo a inactivo, mas no borra el registro
  Usuario.findByIdAndUpdate(id,{estado: false},{new:true},(err,userDeleted)=>{
    if (err) {
      res.status(400).json({
        ok:false,
        err
      })
    }
    else {
      res.json({
        ok:true,
        usuario: userDeleted
      })
    }
  })
})

module.exports = app
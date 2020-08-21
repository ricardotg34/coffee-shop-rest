const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
  let tipo = req.params.tipo;
  let id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No se ha seleccionado ningun archivo'
      }
    })
  }

  let tiposValidos = ['producto', 'usuario'];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Los tipos válidos son: ' + tiposValidos.join(', ')
      }
    });
  }

  let archivo = req.files.archivo;
  let nameFile = archivo.name;
  let extension = nameFile.split('.').slice(-1)[0];
  // Extensiones de archivo válidas
  let validExt = ['png', 'jpg', 'gif', 'jpeg'];

  if (validExt.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Las extensiones válidas son: ' + validExt.join(', ')
      }
    });
  }
  // Cambiar nombre al archivo
  nameFile = `${id}-${new Date().getMilliseconds()}.${extension}`;
  archivo.mv(`uploads/${tipo}/${nameFile}`, (err) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }
    //Aquí ya se ha subido la imagen
    imagenUsuario(id, res, nameFile);
    res.json({
      ok: true,
      message: 'Imagen subida correctamente'
    });
  })
})

function imagenUsuario(id, res, nameFile) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borrarArchivo(nameFile, 'usuarios');
      return res.status(500).json({
        ok: falase,
        err
      });
    }
    if(!usuarioDB){
      borrarArchivo(nameFile, 'usuarios');
      return res.status(400).json({
        ok: false,
        err: {
          message: 'El usuario no existe.'
        }
      });
    }

    borrarArchivo(usuarioDB.img, 'usuarios');

    usuarioDB.img = nombreArchivo;

    usuarioDB.save((err, savedUser) => {
      res.json({
        ok: true,
        usuario: savedUser
      })
    })

  })
}

function borrarArchivo(nombreImagen, tipo) {
  let pathUrl = path.resolve(__dirname, `../../${tipo}/${nombreImagen}`);
  if(fs.existsSync(pathUrl)){
    fs.unlinkSync(pathUrl);
  }
}

module.exports = app;
const express = require('express');
let { verifyToken } = require('../middlewares/authentication');
let app = express();
let Categoria = require('../models/categoria');
// ==================================
// Mostrar categorias
// ==================================
app.get('/categoria', verifyToken, (req, res) => {
  //populate(...) sirve para traer la info de los campos con refernecia, en este caso
  //trae la información del usuario que está referenciado en cada categoría
  Categoria.find({})
  .sort('descripcion')
  .populate('usuario','nombre email')
  .exec((err, categorias) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      categorias
    });

  });
});
// ==================================
// Mostrar categoria por id
// ==================================
app.get('/categoria/:id', (req, res) => {
  let id = req.params.id;
  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
  //Categoria.findbyid
});
// ==================================
// Crear categoria
// ==================================
app.post('/categoria', verifyToken, (req, res) => {
  let body = req.body;
  let categoria = new Categoria({
    descripcion: body.descripcion,
    usuario: req.usuario._id
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

app.put('/categoria/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;

  let newCategoria = {
    descripcion: body.descripcion
  }
  Categoria.findByIdAndUpdate(
    id,
    newCategoria,
    {
      new: true, //Para que en la respuesta regrese el usuario modificado
      runValidators: true //Valida la info con base en el esquema
    },
    (err, categoriaDB) => {
      if (err) {
        res.status(500).json({
          ok: false,
          err
        });
      }
      if (!categoriaDB) {
        res.status(400).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        categoria: categoriaDB
      });
    });
});

app.delete('/categoria/:id', (req, res) => {
  let id = req.params.id;
  Categoria.findByIdAndDelete(id, verifyToken, (err, categoriaDB) => {
    if (err) {
      res.status(500).json({
        ok: false,
        err
      });
    }
    if (!categoriaDB) {
      res.status(400).json({
        ok: false,
        err
      });
    }
    res.json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

module.exports = app;
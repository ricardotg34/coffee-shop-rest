const express = require('express');
let { verifyToken } = require('../middlewares/authentication');
let app = express();
let Producto = require('../models/producto');
let Categoria = require('../models/categoria');
const usuario = require('../models/usuario');

module.exports = app;

// ==================================
// Mostrar productos
// ==================================
app.get('/producto', verifyToken, (req, res) => {
  // Si existe en los parametros de la url se toma ese valor, si no se toma el valor de 0
  //Indica desde que registro deseamos leer
  let page = req.query.page || 1;
  page = Number(page);
  // La paginación será de 5 en 5
  let pageSize = req.query.pageSize || 5;
  pageSize = Number(pageSize);
  //populate(...) sirve para traer la info de los campos con refernecia, en este caso
  //trae la información del usuario que está referenciado en cada categoría
  Producto.find({ disponible: true })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .sort('nombre')
    .populate('usuario')
    .populate('categoria')
    .exec((err, productos) => {
      if (err) {
        res.status(400).json({
          ok: false,
          err
        });
      }
      Producto.count({ disponible: true }, (err, count) => {
        res.json({
          ok: true,
          totalCount: count,
          productos
        });
      });

    });
});

// ==================================
// Mostrar producto por id
// ==================================
app.get('/producto/:id', (req, res) => {
  let id = req.params.id;
  Producto.findById(id)
    .populate('usuario')
    .populate('categoria')
    .exec((err, productoDB) => {
      if (err) {
        res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        res.status(400).json({
          ok: false,
          err
        });
      }
      res.json({
        ok: true,
        producto: productoDB
      });
    });
});

// ==================================
// Crear producto
// ==================================
app.post('/producto', verifyToken, (req, res) => {
  let body = req.body;
  console.log(body);
  Categoria.findById(body.categoria, (err, categoriaDB) => {
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

    let producto = new Producto({
      nombre: body.nombre,
      precioUni: Number(body.precioUni),
      descripcion: body.descripcion,
      categoria: categoriaDB,
      usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
      if (err) {
        res.status(500).json({
          ok: false,
          err
        });
      }
      if (!productoDB) {
        res.status(400).json({
          ok: false,
          err
        });
      }
      res.status(201).json({
        ok: true,
        message: 'El producto ha sido creado',
        producto: productoDB
      });
    });

  });
});

// ==================================
// Actualizar producto
// ==================================
app.put('/producto/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  Producto.findByIdAndUpdate(
    id,
    body,
    {
      new: true, //Para que en la respuesta regrese el usuario modificado
      runValidators: true //Valida la info con base en el esquema
    },
    (err, productoDB) => {
      if (err) {
        res.status(400).json({
          ok: false,
          err
        });
      }
      else {
        res.json({
          ok: true,
          message: 'El producto ha sido modificado',
          producto: productoDB
        });
      }
    });
});

// ==================================
// Borrar producto
// ==================================
app.delete('/producto/:id', (req, res) => {
  let id = req.params.id;
  Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, prodDeleted) => {
    if (err) {
      res.status(400).json({
        ok: false,
        err
      })
    }
    else {
      res.json({
        ok: true,
        producto: prodDeleted
      })
    }
  })
});
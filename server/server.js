require("./config/config")
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

//parse application/x-www-from-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//parse application/json
app.use(bodyParser.json())

//Configuracion global de rutas
app.use(require('./routes/index'))

mongoose.connect(
  'mongodb://localhost:27017/cafe',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (err, res) => {
    if (err) throw err
    console.log("Base de datos online")
  });

app.listen(process.env.PORT, () => {
  console.log(`Escuchando el puerto ${process.env.PORT}`)
})
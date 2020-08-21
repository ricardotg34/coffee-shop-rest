const mongoose = require('mongoose')
let validRole = {
  values: ['ADMIN_ROLE','USER_ROLE'],
  message: '{VALUE} no es un rol valido'
}
let Schema = mongoose.Schema
let usuarioSchema = new Schema({
  nombre:{
    type: String,
    required: [true,'El nombre es necesario'],
  },
  email:{
    type: String,
    required: [true, 'El correo es necesario'],
    unique: true
  },
  password:{
    type: String,
    req: [true, 'El password es obligatorio']
  },
  img:{
    type: String,
    required: false
  },//no es obligatoria
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: validRole
  },//default 'USER_ROLE'
  estado:{
    type: Boolean,
    default: true
  },
  google:{
    type: Boolean,
    default: false
  }
})
usuarioSchema.methods.toJSON = function (params) {
  let user = this
  let userObject = user.toObject()
  delete userObject.password
  return userObject
}

module.exports = mongoose.model('Usuario',usuarioSchema)
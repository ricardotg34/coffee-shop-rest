const jwt = require('jsonwebtoken')
//=============================
//Verificar Token
//=============================
let verifyToken = (req, res, next)=>{
  let token = req.get('Authorization');
  jwt.verify(token, process.env.SEED, (err,decoded)=>{
    if( err ) {
      return res.status(401).json({
        ok: false,
        err
      });
    }
    //Se agrega el usuario a una popiedad del request para poder utilizarla despues
    req.usuario = decoded.usuario
    next();
  });
}

//=============================
//Verificar admin role
//=============================
let verifyAdminToken = (req, res, next)=>{
  let usuario = req.usuario
  if(usuario.role === 'ADMIN_ROLE'){
    next();
  } else {
    return res.status(401).json({
      ok: false,
      err: {
        message: 'El usuario no es administrador'
      }
    });
  }
}

module.exports = {verifyToken, verifyAdminToken}
const jwt = require('jsonwebtoken');
//verificar Token
let verificaToken = (req, res, next)=>{
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED,  (err, decoded)=>{
        if (err) {
            return res.status(401).json({
              ok: false,
              err: {
                  message: 'Token no valido'
              }
            });
          }
          req.usuario = decoded.usuario;
    })

    next();
};


let verificaTokenImagen=(req,res,next)=>{
    let token = req.query.token;
    jwt.verify(token, process.env.SEED,  (err, decoded)=>{
        if (err) {
            return res.status(401).json({
              ok: false,
              err: {
                  message: 'Token no valido'
              }
            });
          }
          req.usuario = decoded.usuario;
    })

    next();
}

//verificar Token
let verificaRol = (req, res, next)=>{
    if(req.usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Rol no permitido'
            }
        });
    }
    

};

module.exports= {
    verificaToken,
    verificaRol,
    verificaTokenImagen
}
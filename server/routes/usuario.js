const express = require('express')
const bcrypt = require('bcrypt')
const Usuario = require('../models/usuario')
const {verificaToken,verificaRol} = require('../middlewares/autenticacion')


const _ = require('underscore')

const app = express()
//[GET]=========================>
app.get('/usuario', verificaToken ,(req, res) =>{
  let desde = Number(req.query.desde) || 0;
  let limite = Number(req.query.limite) || 5;



  Usuario.find({estado:true}, 'nombre').
    skip(desde).
    limit(limite).
    exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        });
      }
      Usuario.count({estado:true}, (err, conteo)=>{
        res.json({
          ok: true,
          total: conteo,
          usuarios: usuarios
        });
      })


    })
})

//[POST]=========================>
app.post('/usuario', [verificaToken,verificaRol] , function (req, res) {
  let body = req.body;


  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    //usarioDB.password=null;

    res.json({
      ok: true,
      usuario: usarioDB
    });

  })

})

//[PUT]=========================>
app.put('/usuario/:id', [verificaToken,verificaRol] , function (req, res) {
  let id = req.params.id
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
  console.log('[ENTRA]')
  Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBD
    });

  });

})

//[DELETE]: Borrar de la BD=========================>
app.delete('/usuario/:id', [verificaToken,verificaRol] , function (req, res) {
  let id = req.params.id
  //Primer opcion borra usuario de la BD el segundo solo actualiza el estado
  //Usuario.findByIdAndRemove(id, (err, usuarioBD)=>{
  Usuario.findByIdAndUpdate(id, {estado: false} ,{new: true} ,(err, usuarioBD)=>{
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    if (!usuarioBD) {
      return res.status(400).json({
        ok: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBD
    });
  });
});




//[EXPORTACION APP CON LA CONFIGURACION DEL CONTROLADIR DEL USUARIO]=========================>

module.exports = app;
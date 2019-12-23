const express = require('express')
const fileUpload = require('express-fileupload')
const Usuario = require('../models/usuario')
const Producto = require('../models/producto')
const app = express()

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
    let id = req.params.id;
    let tipo = req.params.tipo;

    let tipoValido = ['productos', 'usuarios'];

    if (tipoValido.indexOf(tipo) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: `Los tipos permitidos son  ${tipoValido.join(', ')}`
            }
        })
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se han cargado archivos'
            }
        });
    }
    let archivo = req.files.archivo;
    let extension = archivo.name.split('.').pop();


    let extensionesValidas = ['png', 'jpg', 'git', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(500).json({
            ok: false,
            err: {
                message: `Extensiones validas  ${extensionesValidas.join(', ')}`
            }
        })
    }
    let nombre = `${id}-${new Date().getMilliseconds()}.${extension}`
    archivo.mv(`uploads/${tipo}/${nombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        switch (tipo) {
            case "usuarios":
                imagenUsuario(id,res,nombre);
                break;
            case "productos":
                imagenProducto(id,res,nombre)
                break;
        
        }

    });

});


//agrega el nombre de la imagen a un usuario
function imagenUsuario(id, res, nombre) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borrarArchivo(nombre , 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'No existe el usuario'
                }
            });
        }

        borrarArchivo(usuarioBD.img , 'usuarios');
        usuarioBD.img=nombre;
        usuarioBD.save((err, usuarion)=>{
            res.json({
                ok: true,
                usuario: usuarion,
                img: nombre
            });

        })

    })
}

//agrega el nombre de la imagen a un usuario
function imagenProducto(id, res, nombre) {
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borrarArchivo(nombre , 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'No existe el producto'
                }
            });
        }

        borrarArchivo(productoBD.img , 'productos');
        productoBD.img=nombre;
        productoBD.save((err, producton)=>{
            res.json({
                ok: true,
                producto: producton,
                img: nombre
            });

        })

    })
}


function borrarArchivo(nombre, tipo){
    let pathUrl= path.resolve(__dirname,`../../uploads/${tipo}/${nombre}`);
    if (fs.existsSync(pathUrl)) {
        fs.unlinkSync(pathUrl)
    }
}

module.exports = app;
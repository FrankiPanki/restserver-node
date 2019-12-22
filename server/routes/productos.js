const express = require('express');
const Productos = require('../models/producto');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
const _ = require('underscore');
const app = express();

//===========================
//Busca productos por expresion regualar
//===========================
app.get('/productos/buscar/:term', verificaToken, (req, res) => {
    let term = RegExp(req.params.term, 'i');
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Productos.find({disponible:true, nombre: term}).
        skip(desde).
        limit(limite).
        populate('categoria', 'descripcion').
        populate('usuario', 'nombre email').
        exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Productos.count({disponible:true}, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    productos: productos
                });
            })
        })

});


//===========================
//Muestra todas los Productos
//===========================
app.get('/productos', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Productos.find({disponible:true}).
        skip(desde).
        limit(limite).
        populate('categoria', 'descripcion').
        populate('usuario', 'nombre email').
        exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Productos.count({disponible:true}, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    productos: productos
                });
            })
        })

});

//===========================
//Muestra categoria por id
//===========================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id

    Productos.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: productoBD
        });

    });

});
//===========================
//Crea categoria
//===========================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Productos({
        nombre: req.body.nombre,
        precioUni: Number(req.body.precioUni),
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, producton) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: producton
        });
    });
});

app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);

    Productos.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });

    });

});

app.delete('/productos/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id
    Productos.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    });
});


module.exports = app;
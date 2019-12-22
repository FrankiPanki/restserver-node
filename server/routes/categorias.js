const express = require('express');
const Categorias = require('../models/categorias');
const { verificaToken, verificaRol } = require('../middlewares/autenticacion');
const _ = require('underscore');
const app = express();


//===========================
//Muestra todas las categorias
//===========================
app.get('/categorias', verificaToken, (req, res) => {
    Categorias.find({}).
    sort('descripcion').
    populate('usuario', 'nombre email').
    exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categorias.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    usuarios: categorias
                });
            })
        })

});

//===========================
//Muestra categoria por id
//===========================
app.get('/categorias/:id', verificaToken, (req, res) => {
    let id = req.params.id

    Categorias.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });

});
//===========================
//Crea categoria
//===========================
app.post('/categorias', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categorias({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categorian) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categorian
        });
    });
});

app.put('/categorias/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['descripcion']);

    Categorias.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });

    });

});

app.delete('/categorias/:id', [verificaToken, verificaRol], (req, res) => {
    let id = req.params.id
    Categorias.findOneAndRemove(id, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                message: 'Categoria  no encontrada'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});




module.exports = app;
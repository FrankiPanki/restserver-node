const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();





app.post('/login', (req, res) => {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //Verifica si regresa un correo valido
        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(500).json({
                ok: false,
                message: 'Contraseña incorrecta'
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCA });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});

//CONFIGURACIONES DE GOOGLE

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture
    };

}


//[POST]: token de google=========================>
app.post('/google', async (req, res) => {
    token = req.body.idtoken
    let guser = await verify(token).catch(err => {
        return res.status(500).json({
            ok: false,
            err
        });
    });

    Usuario.findOne({ email: guser.email }, (err, usuarioDB) => {
        if (usuarioDB) {
            //Esta registrado pero no con cuenta de google
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: 'Usar autentificacion normal'
                });

            } else {
                //Usuario de google vuelve a ingresar
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCA });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            //Usuario no existe en BD pero inicio sesion con google
            let usuario = new Usuario({
                nombre: guser.name,
                email: guser.email,
                password: bcrypt.hashSync(':)', 10),
                google: true,
                img:guser.picture
            });

            usuario.save((err, usarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                //usarioDB.password=null;
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCA });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            })
        }
    })
})

module.exports = app;
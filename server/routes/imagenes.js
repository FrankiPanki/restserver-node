const express = require('express')
const fs = require('fs')
const path = require('path')
const { verificaToken, verificaTokenImagen } = require('../middlewares/autenticacion');
const app = express()


app.get('/imagen/:tipo/:img', verificaTokenImagen,(req,res)=>{
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathUrl= path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
    let notfound = path.resolve(__dirname, '../assets/notfound.jpeg')
    if (fs.existsSync(pathUrl)) {
        res.sendFile(pathUrl);
    }else{
        res.sendFile(notfound);
    }
});


module.exports = app;


require('./config/config')
const express = require('express')
// Using Node.js `require()`
const mongoose = require('mongoose');
const path = require('path')
const app = express()
const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//configuracion global de rutas
app.use(require('./routes/index'));

//configuracion de la carpeta publica
app.use(express.static(path.resolve(__dirname, '../public')));


mongoose.connect(process.env.URLDB,
  { useNewUrlParser: true, useCreateIndex: true },
  (err, res) => {
    if (err) throw err

    console.log('[Base de datos en linea]')
  });


//=======================================

app.listen(process.env.PORT, () => console.log(`[Eschuchando]: Puerto ${process.env.PORT}`));
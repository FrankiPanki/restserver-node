//puerto
process.env.PORT = process.env.PORT || 3000


//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//SEED o semilla para verificar que sea valido el token

process.env.SEED = process.env.SEED || 'seed-de-desarrollo';


//Tipo de cadudacion de token

process.env.CADUCA = process.env.CADUCA || 60 * 60 * 24 * 24;


//Baase de datos

let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD='mongodb://localhost:27017/cafe';
}else{
    urlBD=process.env.MONGO_URI;
}

process.env.URLDB=urlBD;


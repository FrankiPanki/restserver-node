//puerto
process.env.PORT = process.env.PORT || 3000


//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//SEED o semilla para verificar que sea valido el token

process.env.SEED = process.env.SEED || 'seed-de-desarrollo';


//Tipo de cadudacion de token

process.env.CADUCA = process.env.CADUCA || 60 * 60 * 24 * 24;


//CLIENT ID DE GOOGLE

process.env.CLIENT_ID = process.env.CLIENT_ID || '40782106712-ld173vhse74t1okb3bdosk6impdb4lr8.apps.googleusercontent.com';


//Baase de datos

let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD='mongodb://localhost:27017/cafe';
}else{
    urlBD=process.env.MONGO_URI;
}

process.env.URLDB=urlBD;


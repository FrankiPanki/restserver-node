//puerto
process.env.PORT = process.env.PORT || 3000


//entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

//Baase de datos

let urlBD;
if (process.env.NODE_ENV === 'dev') {
    urlBD='mongodb://localhost:27017/cafe';
}else{
    urlBD='mongodb+srv://francisco:312215@cluster0-ensez.mongodb.net/cafe'
}

process.env.URLDB=urlBD;


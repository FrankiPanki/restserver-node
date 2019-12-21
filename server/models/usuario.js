const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
let Schema = mongoose.Schema;

let rolesValidos={
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE}, no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es nesesario']
    },
    password: {
        type: String,
        required: [true, 'El correo es nesesario']
    },
    email: {
        type: String,
        required: [true, 'La contrasena es nesesaria'],
        unique: true
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false

    },
});
//inyecta el mensaje en los atributos que deben de ser unicos
usuarioSchema.plugin(uniqueValidator, {message : '{PATH} debe de ser unico'})

//borrar el pasword cada vez que se pase el objeto usuario schema a json
usuarioSchema.methods.toJSON= function (){
    let user=this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

module.exports = mongoose.model('Usuario', usuarioSchema);

 
const mongoose = require("../connect");
//var mon = require('mongoose');
//var Schema = mon.Schema;
const Schema = mongoose.Schema;

const usersSchema =  Schema({
    nombre:  {
        type: String,
        required: [true, 'debe poner un nombre']
    },
    ci: {
        type: String,
        required: [true, 'Falta el CI']
    },
    telefono: Number,
    email:{
        type: String,
        required: 'Falta el Email',
        match: /^(([^<>()\[\]\.,;:\s @\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
    },
    password: String,

    fecha_registro: {
        type: Date,
        default: Date.now()
    },
    
});
const users = mongoose.model('Users', usersSchema);//aqui defines un modelo y el controlador tendria que tener un nombre parecido
module.exports = users;

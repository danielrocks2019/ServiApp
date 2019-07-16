const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var clienteSchema = new Schema({
  nombre : String,
  ci : String,
  telefono : Number,
  email:{
    type: String,
    required: 'Falta el Email',
    match: /^(([^<>()\[\]\.,;:\s @\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
},
  password : String,
  Fecha_Registro: {
      type: Date,
      default: Date.now()
  },
  tipo : String
});
var cliente = mongoose.model("Cliente", clienteSchema);
module.exports = cliente;

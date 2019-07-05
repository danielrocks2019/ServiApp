const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var pruebaSchema = new Schema({
  title : String,
  descripcion : String,
  image : Array
});
var prueba = mongoose.model("prueba", pruebaSchema);
module.exports = prueba;
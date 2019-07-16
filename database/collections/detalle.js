const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var detalleSchema = new Schema({
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria"
    },
    producto: {
      type: Schema.Types.ObjectId,
      ref: "Producto"
      },
  cantidad: Number,
  precio : Number 
});
var detalle = mongoose.model("Detalle", detalleSchema);
module.exports = detalle;

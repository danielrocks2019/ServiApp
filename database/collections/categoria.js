const mongoose = require("../connect");
var mon = require('mongoose');
var Schema = mon.Schema;
var categoriaSchema = Schema({

    tienda: {
        type: Schema.Types.ObjectId,
        ref: "Tienda"
    },
    nombre: String,
    precio: {
        type: Number
    },
    descripcion: String,
    fechaRegistro: {
        type: Date,
        default: Date.now()
    },
    foto: String
})
//Nombre, precio, descripción, fechaderegistro, fotografía del producto

var categoria = mongoose.model("Categoria", categoriaSchema);
module.exports = categoria ;

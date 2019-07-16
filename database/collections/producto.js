const mongoose = require("../connect");//pedidos
//var ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

var productoSchema = new Schema({

  cliente: {
  type: Schema.Types.ObjectId,
  ref: "Cliente"
  },

  tienda:{
    type: Schema.Types.ObjectId,
    ref: "Tienda"
  },
  categoria : {
    type: Schema.Types.ObjectId,
    ref: "Categoria"
  },
  lugar_envio: Number,
  precios : Number,
  cantidad :Number,
  Fecha_Registro:
    {
      type:Date,
      default: Date.now()

    },

pago_total : Number,
});
var producto = mongoose.model("Producto", productoSchema);
module.exports = producto;

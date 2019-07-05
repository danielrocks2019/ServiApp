const mongoose = require("../connect");
var mon = require('mongoose');
 var Schema = mon.Schema;
var limgSchema = new Schema({
  name : String,
  idprueba: String,
  physicalpath : String,
  relativepath : String
});
var limg = mongoose.model("limg", limgSchema);
module.exports = limg;
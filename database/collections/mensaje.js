const mongoose = require("../connect");
var io= require("socket.io");
var mon = require('mongoose');
var Schema = mon.Schema; 
const mensaje={
        senderNickname:String,
        message:String
};
const mensajemodel = mongoose.model("mensaje", mensaje);
module.exports = mensajemodel;
//const mensajemodel=mongoose.model('mensaje',mensaje);

//module.exports=mensajemodel;
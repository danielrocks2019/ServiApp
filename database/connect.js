const mongoose = require("mongoose");
mongoose.connect("mongodb://192.168.43.72:27017/tienda",{
  useNewUrlParser:true
}).then(()=>{
  console.log('conexion a mongodb exitosa');
}).catch(err => {
  console.log('error en la conexion', err);
});

module.exports= mongoose;

//172.22.0.2 direcion de cuenta del localhost
//192.168.1.116 direccion router wifi
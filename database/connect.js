const mongoose = require("mongoose");
mongoose.connect("mongodb://192.168.43.72:27017/chat"); //ip wifi 192.168.1.116
mongoose.connect("mongodb://192.168.43.72:27017/Tienda", {
  useNewUrlParser: true
}).then(()=>{
  console.log('connexion a mongodb existosa');
}).catch(err => {
  console.log('error en la connexion', err);
});

module.exports = mongoose;

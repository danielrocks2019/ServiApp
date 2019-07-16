const mongoose = require("mongoose");
mongoose.connect("mongodb://192.168.1.116:27017/chat");
mongoose.connect("mongodb://localhost:27017/Tienda", {
  useNewUrlParser: true
}).then(()=>{
  console.log('connexion a mongodb existosa');
}).catch(err => {
  console.log('error en la connexion', err);
});

module.exports = mongoose;

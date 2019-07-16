var express = require('express');
const multer = require('multer');
var io = require('socket.io');
var router = express.Router();
var fs = require('fs');
var _ = require("underscore");

var Img = require("../../../database/collections/img");

var Categoria = require("../../../database/collections/categoria");
var Producto = require("../../../database/collections/producto");
var Tienda = require("../../../database/collections/tienda");
var Cliente = require("../../../database/collections/../../database/collections/cliente");
var Users = require("../../../database/collections/../../database/collections/users");
var Detalle = require("../../../database/collections/../../database/collections/detalle");
//var Mensaje = require("../../../database/collections/mensaje");

var jwt = require("jsonwebtoken");


const storage = multer.diskStorage({
  destination: function (res, file, cb) {
      try {
          fs.statSync('./public/avatars');
      } catch (e) {
          fs.mkdirSync('./public/avatars');
      }

      cb(null, './public/avatars');
  },
  filename: (res, file, cb) => {

      cb(null, 'IMG-' + Date.now() + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      return cb(null, true);
  }
  return cb(new Error('Solo se admiten imagenes png y jpg jpeg'));
}

const upload = multer({
  storage: storage,

})

router.post("/login", (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;
  var result = Cliente.findOne({email: email,password: password}).exec((err, doc) => {
    if (err) {
      res.status(300).json({
        msn : "No se puede concretar con la peticion "
      });
      return;
    }
    console.log(doc);
    if (doc) {
       console.log(result);
      //res.status(200).json(doc);
      jwt.sign({name: doc.email, password: doc.password}, "secretkey123", (err, token) => {
          console.log(result);
          res.status(200).json({
            resp:200,
            token : token,
            dato:doc
          });
      })
    } else {
      res.status(400).json({
        resp: 400,
        msn : "El usuario no existe ne la base de datos"
      });
    }
  });
});
// instalar Middelware con npm install
function verifytoken (req, res, next) {
  //Recuperar el header
  const header = req.headers["authorization"];
  if (header  == undefined) {
      res.status(403).json({
        msn: "No autorizado"
      })
  } else {
      req.token = header.split(" ")[1];
      jwt.verify(req.token, "secretkey123", (err, authData) => {
        if (err) {
          res.status(403).json({
            msn: "No autorizado"
          })
        } else {
          next();
        }
      });
  }
}

router.post(/tiendaimg\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  upload(req, res, (err) => {
    if (err) {
      res.status(500).json({
        "msn" : "No se ha podido subir la imagen"
      });
    } else {
      var ruta = req.file.path.substr(6, req.file.path.length);
      console.log(ruta);
      var img = {
        idtienda: req.body.idtienda,
        name : req.file.originalname,
        physicalpath: req.file.path,
        relativepath: "http://localhost:7777" + ruta
      };
      var imgData = new Img(img);
      imgData.save().then( (infoimg) => {
       var tienda = {
          fotolugar: new Array()
        }
        Tienda.findOne({_id:id}).exec( (err, docs) =>{
          //console.log(docs);
          var data = docs.fotolugar;
          console.log('data ', data);

          var aux = new  Array();
          if (data.length == 1 && data[0] == "") {
            Tienda.fotolugar.push("/api/v1.0/tiendaimg/" + infoimg._id)
          } else {
            aux.push("/api/v1.0/tiendaimg/" + infoimg._id);
            data = data.concat(aux);
            Tienda.fotolugar = data;
          }
          Tienda.findOneAndUpdate({_id : id}, tienda, (err, params) => {
              if (err) {
                res.status(500).json({
                  "msn" : "error en la actualizacion del usuario"
                });
                return;
              }
              res.status(200).json(
                req.file
              );
              return;
          });
        });
      });
    }
  });
});
router.get(/tiendaimg\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  console.log(id)
  Img.findOne({_id: id}).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn": "Sucedio algun error en el servicio"
      });
      return;
    }
    //regresamos la imagen deseada
    var img = fs.readFileSync("./" + docs.physicalpath);
    //var img = fs.readFileSync("./public/avatars/img.jpg");
    res.contentType('image/jpeg');
    res.status(200).send(img);
  });
});

/*tienda*/
router.post("/tienda", (req, res) => {

  //Ejemplo de validacion
  var data = req.body;
  data ["registerdate"] = new Date();
  var newtienda = new Tienda(data);
  newtienda.save().then((rr) =>{
    res.status(200).json({
      "resp": 200,
      "dato": newtienda,
      "id" : rr._id,
      "msn" :  "Tiendae agregado con exito"
    });
  });
});
router.get("/Tienda",  (req, res) => {
  var skip = 0;
  var limit = "";
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  Tienda.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });

      return;
    }
    res.json({
      result : docs
    });
  });
});



//mostrar  por id los Tienda
router.get(/tienda\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Tienda.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

  res.json({
    result : docs

    });
  })
});
router.delete('/tienda/:id',  (req, res, )=> {
  var idTienda = req.params.id;

  Tienda.findByIdAndRemove(idTienda).exec()
      .then(() => {
        res.status(200).json({
          "resp": 200,
          "msn" :  "eliminado con exito"
        });
      }).catch(err => {
          res.status(500).json({
              error: err
          });
      });


});

router.patch(/tienda\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys = Object.keys(req.body);
  var tienda = {};
  for (var i = 0; i < keys.length; i++) {
    tienda[keys[i]] = req.body[keys[i]];
  }
  console.log(tienda);
  Tienda.findOneAndUpdate({_id: id}, tienda, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json(params);
      return;
  });
});
//Actualiza los datos del tienda
router.put(/tienda\/[a-z0-9]{1,}$/, verifytoken,(req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys  = Object.keys(req.body);
  var oficialkeys = ['nombre', 'nit', 'propiedad', 'calle', 'telefono', 'lat', 'lon'];
  var result = _.difference(oficialkeys, keys);
  if (result.length > 0) {
    res.status(400).json({
      "msn" : "error nose puede  actualizar  utilice patch  para la actualizar"
    });
    return;
  }

  var tienda = {
    nombre : req.body.Nombre,
    nit : req.body.Nit,
    propiedad : req.body.Propiedad,
    calle : req.body.Calle,
    telefono : req.body.Telefono,
    lat : req.body.Lat,
    lon : req.body.Lon

  };
  Tienda.findOneAndUpdate({_id: id}, tienda, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json({
        "resp": 200,
        "dato": tienda,
        "msn" :  "tienda editado con exito"
      });
      return;
  });
});
/*tienda*/

router.post("/categoria", (req, res) => {

  //Ejemplo de validacion
  var data = req.body;
  data ["registerdate"] = new Date();
  var newcategoria = new Categoria(data);
  newcategoria.save().then((rr) =>{
    res.status(200).json({
      "resp": 200,
      "dato": newcategoria,
      "id" : rr._id,
      "msn" :  "menu  agregado con exito"
    });
  });
});
router.get("/categoria",(req, res) => {
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  Categoria.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });
      return;
    }
    res.json({
      result : docs
    });
  });
});

router.get(/categoria\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Categoria.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(400).json({
      "respuesta":400,
      "msn" : "No existe el recurso seleccionado "
    });
  })
});

router.delete('/categoria/:id', (req, res,) => {
  var idCategoria = req.params.id;

  Categoria.findByIdAndRemove(idCategoria).exec()
      .then(() => {

      res.status(200).json({
        "resp": 200,
        "msn" :  "eliminado con exito"
      });
      }).catch(err => {
          res.status(500).json({
              error: err

            });

      });


});

router.patch("/categoria",(req, res) => {
  var params = req.body;
  var id = req.query.id;
  var keys = Object.keys(params);
  var updatekeys = ["nombre", "precio", "descripcion", "foto"];
  var newkeys = [];
  var values = [];

  for (var i  = 0; i < updatekeys.length; i++) {
    var index = keys.indexOf(updatekeys[i]);
    if (index != -1) {
        newkeys.push(keys[index]);
        values.push(params[keys[index]]);
    }
  }
  var objupdate = {}
  for (var i  = 0; i < newkeys.length; i++) {
      objupdate[newkeys[i]] = values[i];
  }
  console.log(objupdate);
  Categoria.findOneAndUpdate({_id: id}, objupdate ,(err, docs) => {
    if (err) {
      res.status(500).json({
          msn: "Existe un error en la base de datos"
      });
      return;
    }
    res.status(200).json({
      "resp": 200,
      "dato": categoria,
      "msn" :  "Categoria  editado con exito"
    });
    return;

  });
});

router.patch('/categoria',(req,res)=>{
  let act=req.body;
  let id=req.params.id;
  User.findByIdAndUpdate(id,act).exec(()=>{
      res.json({
          message:"dato actualizado"
      });
  });
});


router.delete('/:id',(req,res)=>{
  let id=req.params.id;
  User.findByIdAndRemove(id).exec(()=>{
      res.json({
          message:"usuario eliminado"
      });
  });
});



router.put(/categoria\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys  = Object.keys(req.body);
  var oficialkeys = ['nombre', 'precio', 'descripcion'];
  var result = _.difference(oficialkeys, keys);
  if (result.length > 0) {
    res.status(400).json({
      "msn" : "nose puede actualizar error  utilice el formato patch"
    });
    return;
  }

  var categoria = {
    tienda : req.body.tienda,
    nombre : req.body.nombre,
    precio : req.body.precio,
    descripcion : req.body.descripcion,
    foto : req.body.foto

  };
  Categoria.findOneAndUpdate({_id: id}, categoria, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "No se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json({
        "resp": 200,
        "dato": categoria,
        "msn" :  "categoria  editado con exito"
      });
      return;
  });
});

router.post("/cliente",  (req, res) => {


  var data = req.body;
  data ["registerdate"] = new Date();
  var newcliente = new Cliente(data);
  newcliente.save().then((rr) =>{
    res.status(200).json({
      "resp": 200,
      "dato": newcliente,
      "msn" :  "cliente  agregado con exito"
    });
  });
});
router.get("/cliente",(req, res) => {
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  Cliente.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });
      return;
    }
    res.json({
      result : docs
    });
  });
});

/*router.get("/cliente", (req, res, ) =>{
  Cliente.find({}).exec((error, docs) => {

    res.status(200).json({
      "msn" : "No existe el pedido "
    });
  });
});*/

router.get(/cliente\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Cliente.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(200).json({
      "msn" : "No existe el pedido "
    });
  })
});

//elimina un cliente
router.delete(/cliente\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Cliente.find({_id : id}).remove().exec( (err, docs) => {
    res.json({
        message: "cliente eliminado"
        });
  });
});
//Actualizar solo x elementos
router.patch(/cliente\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split( "/")[4];
  var keys = Object.keys(req.body);
  var cliente = {
    nombre : req.body.nombre,
    ci : req.body.ci,
    telefono : req.body.telefono,
    email : req.body.email,

  };
  console.log(cliente);
  Cliente.findOneAndUpdate({_id: id}, cliente, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json({
        "resp": 200,
        "dato": cliente,
        "msn" :  "cliente  editado con exito"
      });
      return;
  });
});
//Actualiza los datos del cliente
router.put(/cliente\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys  = Object.keys(req.body);
  var oficialkeys = ['nombre', 'ci', 'telefono', 'email',];
  var result = _.difference(oficialkeys, keys);
  if (result.length > 0) {
    res.status(400).json({
      "msn" : "erorr no se puede actualizar intenten con patch"
    });fmulter
    return;
  }
  var cliente = {
    nombre : req.body.nombre,
    ci : req.body.ci,
    telefono : req.body.telefono,
    email : req.body.email,

  };
  Cliente.findOneAndUpdate({_id: id}, cliente, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json({
        "resp": 200,
        "dato": cliente,
        "msn" :  "cliente  editado con exito"
      });
      return;
  });
});

//insertar datos de producto
router.post("/producto",  (req, res) => {


  var data = req.body;
  data ["registerdate"] = new Date();
  var newproducto = new Producto(data);
  newproducto.save().then((rr) =>{
    res.status(200).json({
      "resp": 200,
      "dato": newproducto,
      "msn" :  "producto  agregado con exito"
    });
  });
});
router.get("/producto", (req, res, next) =>{
  Producto.find({}).populate("categoria").populate("cliente").populate("tienda").exec((error, docs) => {
    res.status(200).json(docs);
  });
});

router.get(/producto\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Producto.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(200).json({

        "array_texto":
          {
            "texto":"<b>producto</b>",
            "texto":"registrado con exito"
          }


    });
  })
});
//elimina una producto
router.delete('/producto/:id', (req, res,) => {
  var idProducto = req.params.id;

  Producto.findByIdAndRemove(idProducto).exec()
      .then(() => {
          res.json({
              message: "producto eliminado"
          });
      }).catch(err => {
          res.status(500).json({
              error: err
          });
      });


});
//Actualizar solo x elementos
router.patch(/producto\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys = Object.keys(req.body);
  var producto = {};
  for (var i = 0; i < keys.length; i++) {
    producto[keys[i]] = req.body[keys[i]];
  }
  console.log(producto);
  Producto.findOneAndUpdate({_id: id}, producto, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json({
        "resp": 200,
        "dato": producto,
        "msn" :  "producto  editado con exito"
      });
      return;
  });
});
//Actualiza los datos del producto
router.put(/producto\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys  = Object.keys(req.body);
  var oficialkeys = ['idmenu', 'idtienda', 'cantidad', 'idcliente', 'lat', 'lon', 'pagototal'];
  var result = _.difference(oficialkeys, keys);
  if (result.length > 0) {
    res.status(400).json({
      "msn" : "Existe un error en el formato de envio puede hacer uso del metodo patch si desea editar solo un fragmentode la informacion"
    });
    return;
  }

  var Producto = {
    menu : req.body.idmenu,
    tienda : req.body.idtienda,
    cliente : req.body.idcliente,
    lugar_envio : req.body.lugar_envio,
    cantidad : req.body.cantidad,
    precio : req.body.precio,
    pagototal : req.body.pagototal
  };
  Producto.findOneAndUpdate({_id: id}, producto, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos de la producto"
        });
        return;
      }
      res.status(200).json({
        "resp": 200,
        "dato": producto,
        "msn" :  "producto  editado con exito"
      });
      return;
  });
});
//insertar un nuevo usuario en la  base de datos
router.post('/users', function(req, res, next) {
  const datos = {
    nombre: req.body.Nombre,
    ci: req.body.Ci,
    telefono: req.body.Telefono,
    email: req.body.Email,
    password: req.body.Password,
    };
  var modelUsers = new Users(datos);

  modelUsers.save().then( result => {
    res.json({
      message: "usuario registrado  con exito "
    });
  })
  .catch(err => {
    res.status(500).json({
        erroikr: err
    })
  });
});
//muestra todos los usuarios existente de la tabla
router.get("/users", (req, res, next) =>{
  Users.find({}).exec((error, docs) => {
    res.status(200).json(docs);
  });
});
//muestra los usuarios por su id
router.get(/users\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Users.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.status(200).json({
      "msn" : "No existe el usuario "
    });
  });
});

//elimina  usuario
router.delete(/users\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Users.find({_id : id}).remove().exec( (err, docs) => {
      res.status(200).json(docs);
  });
});
//Actualizar solo x elementos
router.patch(/users\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys = Object.keys(req.body);
  var users = {};
  for (var i = 0; i < keys.length; i++) {
    users[keys[i]] = req.body[keys[i]];
  }
  console.log(users);
  Users.findOneAndUpdate({_id: id}, users, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json(params);
      return;
  });
});
//Actualiza los datos del Usuario
router.put(/users\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys  = Object.keys(req.body);
  var oficialkeys = ['Nombre', 'Ci', 'Telefono', 'Email', 'Password', 'Tipo_Usuario'];
  var result = _.difference(oficialkeys, keys);
  if (result.length > 0) {
    res.status(400).json({
      "msn" : "Existe el usuario"
    });
    return;
  }

  var users = {
    nombre: req.body.nombre,
    ci: req.body.ci,
    telefono: req.body.telefono,
    email: req.body.email,
    password: req.body.password,
     };
  Users.findOneAndUpdate({_id: id}, users, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos del usuario"
        });
        return;
      }
      res.status(200).json(params);
      return;
  });
});





router.post("/detalle",  (req, res) => {

  //Ejemplo de validacion
  var data = req.body;
  data ["registerdate"] = new Date();
  var newdetalle = new Detalle(data);
  newdetalle.save().then((rr) =>{
    res.status(200).json({
      "resp": 200,
      "dato": newtienda,
      "id" : rr._id,
      "msn" :  "pedidos agregado con exito"
    });
  });
});
router.get("/productos",(req, res) => {
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  Producto.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });
      return;
    }
    res.json({
      result : docs
  });
});



//mostrar  por id detalle
router.get(/producto\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Producto.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

    res.json({
      result : docs    });
  })
});
//elimina un tienda
router.delete('/detalle/:id',  (req, res, )=> {
  var idDetalle = req.params.id;

  Producto.findByIdAndRemove(idProducto).exec()
      .then(() => {
          res.json({
              message: "Producto eliminado"
          });
      }).catch(err => {
          res.status(500).json({
              error: err
          });
      });


});
//Actualizar solo x elementos
router.patch(/pedidos\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys = Object.keys(req.body);
  var pedidos = {};
  for (var i = 0; i < keys.length; i++) {
    pedidos[keys[i]] = req.body[keys[i]];
  }
  console.log(tienda);
  Pedidos.findOneAndUpdate({_id: id}, pedidos, (err, params) => {
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }

      res.status(200).json({
        "resp": 200,
        "dato": producto,
        "msn" :  "producto editado con exito"
      });
      return;

      });
  });
});
// abriendo chats
//agregar sockets par ala conversacion de  reennvio de informacion
//control de sockets agregar


 //////////////////////////////SERVICES BY AMILKAR /////////////////////////////////////////
 /*

 const Producto = require('../../../database/collections/productos')
 const Img = require('../../../database/collections/img')
 const express = require('express')


 //esta variables toma el valor de la IP
 const HOST = require('../../../database/collections/HOST')

 //////////////////////// multer para imagenes
 const multer = require('multer');

 const fs = require('fs')

 const route = express.Router()

 // metodos de peticion GET, POTS, PUT, DELETE

 route.get('/', (req, res) =>{
     res.send({ menssage:'SERVICIO API-RES TIENDA MOVIL'})
 })


 var storage = multer.diskStorage({
     destination: "./public/avatars",
     filename: function (req, file, cb) {
       console.log("-------------------------");
       console.log(file);
       cb(null, "IMG_" + Date.now() + ".jpg");
     }
   });
   var upload = multer({
     storage: storage
   }).single("img");;


 route.post('/productoimg', (req, res) => {
     //var url = req.url;
     //console.log(url);
     var id = productoid;
     upload(req, res, (err) => {
       if (err) {
         res.status(500).json({
           "msn" : "No se ha podido subir la imagen"
         });
       } else {
         var ruta = req.file.path.substr(6, req.file.path.length);
         console.log(ruta);
         var img = {
           idproducto: id,
           name : req.file.originalname,
           physicalpath: req.file.path,
           relativepath: `${HOST}:7777`
           //////////////////////////////7////////////relativepath: `${HOST}:4030`
                         //  http://192.168.1.5:4030
         };
         var imgData = new Img(img);
         imgData.save().then( (infoimg) => {
           //content-type
           //Update User IMG
           var producto = {
             gallery: new Array()
           }
           Producto.findOne({_id:id}).exec( (err, docs) =>{
         console.log(docs);
         var data = docs.gallery;
         var aux = new  Array();
         if (data.length == 1 && data[0] == "") {
           producto.gallery.push(`${HOST}:7777/api/v1.0/productoimg/` + infoimg._id)

         } else {
           aux.push(`${HOST}:7777/api/v1.0/productoimg/` + infoimg._id);

           data = data.concat(aux);
           producto.gallery = data;
         }
         ////////////////////////////////////////////////////////////////Producto.useFindAndModify({_id : id}, producto, (err, params) => {
         Producto.findOneAndUpdate({_id : id}, producto, (err, params) => {

           //useFindAndModify
             if (err) {
               res.status(500).json({
                 "msn" : "error en la actualizacion del usuario"
               });
               return;
             }
             res.status(200).json(
               req.file
             );
             return;
         });
       });
     });
   }
 });
 });

//metod get for images
 */

/*
 route.get(/productoimg\/[a-z0-9]{1,}$/, (req, res) => {
   var url = req.url;
   var id = url.split("/")[2];
   console.log(id)
   Img.findOne({_id: id}).exec((err, docs) => {
     if (err) {
       res.status(500).json({
         "msn": "Sucedio algun error en el servicio"
       });
       return;
     }
     //regresamos la imagen deseada
     var img = fs.readFileSync("./" + docs.physicalpath);
     //var img = fs.readFileSync("./public/avatars/img.jpg");
     res.contentType('image/jpeg');
     res.status(200).send(img);
   });
 });

*/
/*




var productoid;


  route.post("/producto", (req, res) => {
    //Ejemplo de validacion
  console.log("request; ",req.body)

    var producto = {
      city: req.body.city,
      categoria: req.body.categoria,
      estado : req.body.estado,

      nombre : req.body.nombre,
      precio : req.body.precio,
      cantidad : req.body.cantidad,
      descripcion : req.body.descripcion,
      gallery : "",
      contacto: req.body.contacto
    };


  var productoData = new Producto(producto)

    productoData.save().then( (rr) => {
      //content-type
      productoid=rr._id;                           //variable que guarda el id de producto
      res.status(200).json({
        "id" : rr._id,
        "msn" : "producto registrado con exito "
      });
    });
  });
/*
city: String,
categoria: String,
estado :String,
nombre : String,
precio : Number,
cantidad : Number,
contacto : Number,
descripcion : String,
  gallery : Array,

date: {type:Date,default:Date.now()}

*/

/*

//get product
  route.get("/producto", (req, res, next) => {
      var params = req.query;

      var datos = Producto.find({precio: params.precio});
      console.log(datos);
      var city = params.city;
      var categoria = params.categoria;
      var estado = params.estado;
      var nombre = params.nombre;
      var precio = params.precio;
      var cantidad= params.cantidad;
      var over = params.over;

      if (precio == undefined && over == undefined) {
  // filtra los datos que tengan en sus atributos lat y lon null;
  Producto.find({lat:{$ne:null},lon:{$ne:null}}).exec( (error, docs) => {
  res.status(200).json(
    {
      info: docs
    }
  );
  })
  return;
  }
  if (over == "equals") {
      Producto.find({$and:[{city:city},{categoria:categoria},{estado:estado},{precio:precio},{cantidad:cantidad}]}).exec( (error, docs) => {
        res.status(200).json(
          {
            info: docs
          }
        );
        console.log("----------------estos sons iguales-----------------")
      })
      return;
    }else if ( over == "true") {
        console.log("----------------estos sons mayores igual-----------------")
      Producto.find({$and:[{city:city},{categoria:categoria},{estado:estado},{precio:{$gte:precio}},{cantidad:{$gte:cantidad}}]}).exec( (error, docs) => {
        res.status(200).json(
          {
            info: docs
          }
        );
      })
    }else if (over == "false") {
        console.log("----------------estos son los menores/igual-----------------")
      Producto.find({$and:[{city:city},{categoria:categoria},{estado:estado},{precio:{$lte:precio}},{cantidad:{$lte:cantidad}}]}).exec( (error, docs) => {
        res.status(200).json(
          {
            info: docs
          }
        );
      })
    }
    });

/// get productos
    // muestra la peticin de acuerdo a un paraetro de busqueda
      route.get("/producto2/search=:srt", (req, res, next) => {
        console.log(req.params)
        let search =req.params.srt

        Producto.find({estado:new RegExp(search, 'i')}).exec( (error, docs) => {
          res.status(200).json(
            {
              info: docs
            }
          );
        })
    });




    // busqueda por _id //////
    route.get('/productoid/:id', (req, res) => {
      var idh = req.params.id;
      console.log(idh)
      Producto.findById({_id:idh}).exec((err, docs) => {
        if (err) {
          res.status(500).json({
            "msn": "Hay algun error en la busqueda"

          });
          return;
        }
        res.status(200).send(docs);
      });
    });
    ///////////////// fin productos////////////////











*/


module.exports = router;

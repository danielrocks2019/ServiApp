var express = require('express');
const multer = require('multer');
var router = express.Router();
var fs = require('fs');
var _ = require("underscore");

var Img = require("../../../database/collections/img");
var Producto = require("../../../database/collections/../../database/collections/producto");
var Cliente = require("../../../database/collections/../../database/collections/cliente");


/*Producto*/


router.post("/producto", (req, res) => {

  //Ejemplo de validacion
  var data = req.body;
  data ["registerdate"] = new Date();
  var newproducto = new Producto(data);
  newproducto.save().then((rr) =>{
    res.status(200).json({
      "resp": 200,
      "dato": newproducto,
      "id" : rr._id,
      "msn" :  "Producto agregado con exito"
    });
  });
});

router.get("/producto",  (req, res) => {
  var skip = 0;
  var limit = "";
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
});

//mostrar  por id los productos
router.get(/producto\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Producto.findOne({_id : id}).exec( (error, docs) => {
    if (docs != null) {
        res.status(200).json(docs);
        return;
    }

  res.json({
    result : docs

    });
  })
});

//elimina un producto
/*router.delete(/producto\/[a-z0-9]{1,}$/, verifytoken, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  Producto.find({_id : id}).remove().exec( (err, docs) => {
      res.status(200).json(docs);
  });
});*/
router.delete('/producto/:id',  (req, res, )=> {
  var idProducto = req.params.id;

  Producto.findByIdAndRemove(idProducto).exec()
      .then(() => {
        res.status(200).json({
          "resp": 200,
          "msn" :  " Producto eliminado con exito"
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
      res.status(200).json(params);
      return;
  });
});

//Actualiza los datos del Producto
router.put(/producto\/[a-z0-9]{1,}$/, verifytoken,(req, res) => {
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

  var producto = {
    nombre : req.body.Nombre,
    nit : req.body.Nit,
    propiedad : req.body.Propiedad,
    calle : req.body.Calle,
    telefono : req.body.Telefono,
    lat : req.body.Lat,
    lon : req.body.Lon

  };
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
        "msn" :  "Producto editado con exito"
      });
      return;
  });
});
/*Producto*/

/*CLIENTE*/
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

//elimina un cliente  ==> funciona
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
    apellidos : req.body.apellidos,
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
  var oficialkeys = ['nombre', 'apellidos','ci', 'telefono', 'email',];
  var result = _.difference(oficialkeys, keys);
  if (result.length > 0) {
    res.status(400).json({
      "msn" : "erorr no se puede actualizar intenten con patch"
    });fmulter
    return;
  }
  var cliente = {
    nombre : req.body.nombre,
    apellidos : req.body.apellidos,
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

/*CARGAR IMAGENES*/

router.post(/productoimg\/[a-z0-9]{1,}$/, (req, res) => {
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
        idProducto: req.body.idProducto,
        name : req.file.originalname,
        physicalpath: req.file.path,
        relativepath: "http://localhost:8000" + ruta
      };
      var imgData = new Img(img);
      imgData.save().then( (infoimg) => {
        //content-type
        //Update User IMG
        var producto = {
          fotolugar: new Array()
        }
        Producto.findOne({_id:id}).exec( (err, docs) =>{
          //console.log(docs);
          var data = docs.fotolugar;
          console.log('data ', data);

          var aux = new  Array();
          if (data.length == 1 && data[0] == "") {
            Producto.fotolugar.push("/api/v1.0/productoimg/" + infoimg._id)
          } else {
            aux.push("/api/v1.0/productoimg/" + infoimg._id);
            data = data.concat(aux);
            Producto.fotolugar = data;
          }
          Producto.findOneAndUpdate({_id : id}, producto, (err, params) => {
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

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    res.send('mensaje de que funciona');

});

module.exports=router;
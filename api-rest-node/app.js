'use strict'

//Requires
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();
//Cargar archivos de rutas
//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//CORS
//Rescribir rutas
// Rutas de prueba
app.get('/prueba', (req,res)=>{
    return res.status(200).send({
        nombre:"Juan Quiros",
        message:"Hola mundo desde el back-end con Node"
    });
})
//Exportar Modulo
module.exports = app;
'use strict'

//Requires
var express = require('express');
var bodyParser = require('body-parser');

//Ejecutar express
var app = express();
//Cargar archivos de rutas
var user_routes = require('./routes/user');
//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//CORS
//Rescribir rutas
app.use('/api', user_routes);
//Exportar Modulo
module.exports = app;
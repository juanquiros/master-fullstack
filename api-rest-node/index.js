'use strict'

var mongoose = require('mongoose');
var app =require('./app');
var port = process.env.port || 3999;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://usuario:password01!@cluster0.bqggf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{useNewUrlParser: true})
.then(()=>{
    console.log('La conexión a la base de datos se realizo correctamente');
    app.listen(port,() => {
        console.log('El servidor http://localhost:3999 está funcionando!!!');
    });
})
.catch(error => console.log(error));
'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');

var secret ='miclavesecretaparagenerareltoken-999';
exports.authenticated = function(req, res, next){
    
    // Comprobar si llega autorización
    if(!req.headers.authorization){
        return res.status(403).send({
            message:'La peticion no tiene la cabecera de authorization'
        });

    }
    //limpiar el token y quitar comillas
    var token =req.headers.authorization.replace(/['"]+/g,'');
    //decodificar token
    try{
        var payload = jwt.decode(token,secret);
        //Comprobar si ha expirado
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                message:'El token ha expirado'
            });
        }
    }catch(ex){
        return res.status(404).send({
            message:'El token no es válido'
        });
    }
    

    //Adjuntar usuario identificado a la request
    req.user = payload;
    //Pasar a la accion
    next();
}
'use strict'
var validator=require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var controller = {
    probando: function(req,res){
        return res.status(200).send({
            message:"soy el metodo probando"
        });
    },
    testeando: function(req,res){
        return res.status(200).send({
            message:"soy el metodo testeando"
        });
    },
    save: function(req,res){
        //Recoger los parametros de la peticion
        var params = req.body;
        //Validar los datos
        var validate_name = !validator.isEmpty(params.name);
        var validate_surname = !validator.isEmpty(params.surname);
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);
        //console.log(validate_name,validate_surname,validate_email,validate_password);
        if(validate_name && validate_surname && validate_email &&validate_password){
            //Crear objeto de usuario
                var user = new User();
            //asignar los valores
            user.name=params.name;
            user.surname=params.surname;
            user.email=params.email;
            user.role='ROLE_USER';
            user.image=null;
            //comprobar que no exista
            User.findOne({email:user.email},(err,issetUser)=>{
                if(err){
                    return res.status(500).send({
                        message:"Error al comprobar duplicidad de usuarios"
                    });
                }
                if(!issetUser){
                    // cifrar password
                    bcrypt.hash(params.password,null,null,(err,hash)=> {
                        user.password = hash;
                        //guardar usuario
                        user.save((err,userStored)=>{
                            if(err){
                                return res.status(500).send({
                                    message:"El usuario no se a guardado"
                                });
                            }
                            if(!userStored){
                                return res.status(500).send({
                                    message:"El usuario no se a guardado"
                                });
                            }
                            //respuesta
                            return res.status(200).send({
                                status:'success',
                                user:userStored
                            });
                        });//close save
                    });//close bcrypt
                    
                }else{
                    return res.status(200).send({
                        message:"El usuario ya esta registrado"
                    });
                }
            })
            

        }else{
            return res.status(200).send({
                message:"Registro de usuario - Los datos son incorrectos"
            });
        }

        
    }
};
module.exports = controller;
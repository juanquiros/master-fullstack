'use strict'
var validator=require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
const { checkout } = require('../routes/user');
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

        
    },
    login: function(req,res){
        //recoger datos
        var params = req.body;
        //validar datos
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);
        if(!validate_email || !validate_password){
            return res.status(500).send({
                message:"Datos incorrectos"
            });
        }
        //buscar usuarios con email
        User.findOne({email:params.email.toLowerCase()},(err,user)=>{
            if(err){
                return res.status(500).send({
                    message:"Error al intentar identificarse"
                });
            }
            if(!user){
                return res.status(404).send({
                    message:"El usuario no existe"
                });
            }
            //comprobar la contraseña
            bcrypt.compare(params.password, user.password, (err,check)=>{
                if(err){

                }
                if(check){
                    
                    //generar token jwt
                    if(params.gettoken){
                        return res.status(200).send({
                            token:jwt.createToken(user)
                        });
                    }else{
                        //limpiar objeto
                        user.password = undefined;
                        //devolver datos
                        return res.status(200).send({
                            status:'success',
                            user
                        });
                    }
                    
                }else{
                    return res.status(200).send({
                        message:"Las credenciales no son correctas"
                    });
                }
            });
            
        });
        
    },
    update: function(req,res){
        //crear middleware  para comprobar el jwt token, ponerselo a la ruta
        
        return res.status(200).send({
            message:"update"
        });
    }
};
module.exports = controller;
'use strict'
var validator=require('validator');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
const { exists } = require('../models/user');
const user = require('../models/user');

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
        try{
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        }catch(err){
            return res.status(200).send({
                message:"Faltan datos por enviar"
            });
        }
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
        try{
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        }catch(err){
            return res.status(200).send({
                message:"Faltan datos por enviar"
            });
        }
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
        //RECOGER DATOS DEL USUARIO
        var params =req.body;
        //VALIDAR DATOS
        //Validar los datos
        try{
        var validate_name = !validator.isEmpty(params.name);
        var validate_surname = !validator.isEmpty(params.surname);
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        }catch(err){
            return res.status(200).send({
                message:"Faltan datos por enviar"
            });
        }
        //ELIMINAR PROPIEDADES INNECESARIAS
        delete params.password;
        //comprobar email
            if(req.user.email != params.email){
                User.findOne({email:params.email.toLowerCase()},(err,user)=>{
                    if(err){
                        return res.status(500).send({
                            message:"Error al intentar identificarse"
                        });
                    }
                    if(user && user._id!= req.user.sub){
                        return res.status(200).send({
                            message:"El email no puede ser modificado"
                        });
                    }else{
                        //BUSCAR Y ACTUALIZAR DOCUMENTO
                        var userId = req.user.sub;
                        User.findOneAndUpdate({_id:userId}, params,{new:true},(err,userUpdated)=>{
                            if(err || !userUpdated){
                                return res.status(500).send({
                                    status:'error',
                                    message:'Error al actualizar usuario'
                                });
                            }
                            //DEVOLVER RESPUESTA
                            return res.status(200).send({
                                status:'success',
                                userUpdated
                            });
                        } );
                    }
            });
        }
        
        
    },
    uploadAvatar: function(req,res){
        //Configurar el modulo multiparty en ruter
        //Recoger el fichero de la peticion
        var file_name = 'Avatar no subido...';
        
        if(!req.files.file0){
            return res.status(200).send({
                status:'err',
                message:'no se existe avatar'
            });
        }
        //Conseguir el nombre y la extension
        var file_path= req.files.file0.path;
        var file_split = file_path.split('\\');
        //advertencia en linux o mac  var file_split = file_path.split('/');
        var file_name = file_split[2]; //nombre
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; //extencion
        //comprobar solo imagen y borrar si no es valida
        if(file_ext!='png' && file_ext!='jpg' && file_ext!='jpeg' && file_ext!='gif'){
            fs.unlink(file_path,(err)=>{
                return res.status(200).send({
                    status:'error',
                    message:'La extensión del archivo no es valida'
                });
            });
        }else{
            //sacar el id fel usuario identificado
            var userId = req.user.sub;
            //buscar y actualizar documento db
            User.findOneAndUpdate({_id:userId},{image:file_name},{new:true},(err,userUpdated)=>{
                if(err || !userUpdated){
                    return res.status(200).send({
                        status:'error',
                        message:'Error al actualizar el Usuario'
                    });
                }
                //Devolver respuesta
                return res.status(200).send({
                    status:'success',
                    message:'Upload Avatar',
                    userUpdated
                });
            });
            
        }
        
    },
    avatar: function(req,res){
        var fileName = req.params.fileName;
        var pathFile = './uploads/users/'+fileName;

        fs.exists(pathFile,(exists)=>{
            if(exists){
                return res.sendFile(path.resolve(pathFile));
            }else{
                return res.status(404).send({
                    message: 'La imagen no existe'
                })
            }
        });
    },
    users: function(req,res){
        User.find().exec((err,users)=>{
            if(err || !users){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay usuarios que mostrar'
                });
            }

            return res.status(200).send({
                status:'success',
                users
            });
        });
    },
    getUser: function(req,res){
        var userId = req.params.userId;
        User.findById(userId).exec((err,user)=>{
            if(err || !user){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el usuario'
                });
            }

            return res.status(200).send({
                status:'success',
                user
            });
        });
    }
};
module.exports = controller;
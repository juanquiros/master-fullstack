'use strict'
var validator=require('validator');
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

            //asignar los valores

            //comprobar que no exista

            // cifrar password

            //guardar usuario

            //respuesta

        }else{
            return res.status(200).send({
                message:"Registro de usuario",
            });
        }
    }
};
module.exports = controller;
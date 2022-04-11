'use strict'
var validator = require('validator');
var Topic = require('../models/topic');
var controller = {
    test: function(req,res){
        return res.status(200).send({
            message : 'Hola desde test de Controller topics'
        });
    },
    save: function(req,res){
        //recoger parametros
        var params = req.body;
        //validar los datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);

        }catch(err){
            return res.status(200).send({
                message : 'Faltan datos por enviar'
            });
        }
        if(validate_lang && validate_content && validate_title){
            //crear objeto
            var topic = new Topic();
            //asignar valores
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            //guardar
            topic.save((err,topicStored)=>{
                if(err || !topicStored){
                    return res.status(404).send({
                        status:'error',
                        message : 'El tema no se ha guardado'
                    });
                }
                    //devolver una repuesta
                    return res.status(200).send({
                        status: 'success',
                        topic:topicStored
                    });
            });
            
        }else{
            
            return res.status(200).send({
                message : 'Los datos no son correctos'
            });
        }
    },
    getTopics: function(req,res){
        //cargar la libreria de paginacion en la clase
        //recoger la pagina actual
        //indicar las opciones de paginacion
        //find paginado
        // devolver resultado (topics, total de topics, total de paginas)
        return res.status(200).send({
            message:'Este es el metodo get topics'
        });
    }
}

module.exports = controller;
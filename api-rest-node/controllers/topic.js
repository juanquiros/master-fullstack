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
            topic.user = req.user.sub;
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
        //cargar la libreria de paginacion en la clase (en el modelo)
        
        //recoger la pagina actual
        var page = req.params.page;
        if( page==undefined || req.params.page == 0 || req.params.page == "0"){
            page = 1;
        }else{
            page = parseInt(page);
        }
        //indicar las opciones de paginacion
        var options = {
            short:{date:-1},//desendente
            populate:'user', //cargar objeto user
            limit:5,
            page:page
        }
        //find paginado
        Topic.paginate({},options,(err,topics)=>{
            if(err){
                return res.status(500).send({
                    status:'error',
                    message:'Error al hacer consulta'
                });
            }
            if(!topics){
                return res.status(404).send({
                    status:'notFound',
                    message:'No hay topics'
                });
            }
            // devolver resultado (topics, total de topics, total de paginas)
            return res.status(200).send({
                status:'success',
                topics: topics.docs,
                totalDocs:topics.totalDocs,
                totalPage:topics.totlPage
            });
        });
        
    },
    getTopicsByUser: function(req,res){
        //get user_id
        var userId = req.params.user;
        var page = req.params.page;
        if( page==undefined || req.params.page == 0 || req.params.page == "0"){
            page = 1;
        }else{
            page = parseInt(page);
        }
        //indicar las opciones de paginacion
        var options = {
            short:{date:-1},//desendente
            populate:'user', //cargar objeto user
            limit:5,
            page:page
        }
        //find con la condicion de usuario
        Topic.paginate({user:userId},options,(err,topics)=>{
                if(err){
                    //devolver resultado
                    return res.status(500).send({
                        status:'error',
                        message: 'Error en la peticion'
                    });
                }
                if(!topics || topics.length == 0){
                    //devolver resultado
                    return res.status(404).send({
                        status:'error',
                        message:'No hay temas para mostrar'
                    });
                }
                //devolver resultado
                    return res.status(200).send({
                        status:'success',
                        topics
                    });
                    });
        
        
        
    },
    getTopic:function(req, res){
        //sacar id del topic de la url
        var topicId = req.params.id;
        //find por id del topic
        Topic.findById(topicId)
            .populate('user')
            .exec((err,topic)=>{
                if(err){
                    return res.status(500).send({
                        status:'error',
                        message:'Error en la peticion',
                        sv_err:err.message
                    });
                }
                if(!topic || topic.length ==0){
                    return res.status(404).send({
                        status:'error',
                        message:'No hay topic para mostrar'
                    });
                }
                return res.status(200).send({
                    status:'success',
                    topic
                });
            });

        
    },
    update:function(req,res){
        //Recoger el id del topic 
        var topicId = req.params.id;
        //Recoger los datos
        var data = req.body;
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
            //Montar un json con los datos modificados
            var update = {
                title: params.title,
                content: params.content,
                code:params.code,
                lang:params.lang
            }
            //find por id de topic y id de usuario
            Topic.findOneAndUpdate({_id:topicId,user:req.user.sub},update,{new:true},(err,topicUpdate)=>{
                if(err){
                    return res.status(500).send({
                        status:'error',
                        message:'Error en la petición'
                    });
                }
                if(!topicUpdate || topicUpdate.length ==0){
                    return res.status(404).send({
                        status:'error',
                        message:'No se ah actualizado el tema'
                    });
                }
                //devolver respuesta
                return res.status(200).send({
                    status:'success',
                    topicUpdate
                });
            });
            
        }else{
            return res.status(200).send({
                message : 'Los datos no son correctos'
            });
        }

        
        
    }
}

module.exports = controller;
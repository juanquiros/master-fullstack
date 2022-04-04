'use strict'

exports.authenticated = function(req, res, next){
    console.log('middleware');
    next();
}
'use strict'

var express = require('express');
var TopicsController = require('../controllers/topic');
var router = express.Router();
var md_auth = require('../middlewares/authenticated');


router.get('/test',TopicsController.test);
router.post('/topic',md_auth.authenticated,TopicsController.save);
router.get('/topics/:page?',TopicsController.getTopics);
module.exports = router;
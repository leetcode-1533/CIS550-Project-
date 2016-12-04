var express = require('express');
var router = express.Router();
var events = require('events');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
require('../models/Quiz');

var Quiz = mongoose.model('Quiz');

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'olympicquiz.cziypygdpbbb.us-west-2.rds.amazonaws.com',
  user     : 'shahanimesh94',
  password : 'shahanimesh94',
  port     : '3306',
  database : 'olympic_quiz'
});

router.get('/test_http', function(req, res, next) {
  var EventEmitter = events.EventEmitter;
  var flowController = new EventEmitter();
  console.log(req.query.question_id);

  flowController.on('dowork', function(obj) {
    connection.query(obj["questionquery"], function (err, row) {
      connection.query(obj['options'], function (err, options) {
        if (err) console.log(err);
          console.log(obj['question']);
          // res.send({results: [{"question":obj['question']},
        //     {"answer":[row[0], options[0],options[1],options[2]]}]});//options
        res.json({"question":obj['question'],
          "answer":[row[0], options[0],options[1],options[2]]});//options
      });
    });
  });

  Quiz.findOne({"q_id": req.query.question_id}, function(err, obj) {
    var temp = obj['questionquery'];
    console.log(obj['questionquery']);
    flowController.emit('dowork', obj);
  })

  flowController.on('finished', function () {
    console.log('finished');
  });
});

module.exports = router;

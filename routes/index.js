var express = require('express');
var router = express.Router();
var events = require('events');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
require('../models/Quiz');
require('../models/leaderboard');

var MongoClinet = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://kirasev:Kirasev101@ds159237.mlab.com:59237/sqlympics';
var Quiz = mongoose.model('Quiz');

var leaderboard = mongoose.model('leaderboard');

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'olympicquiz.cziypygdpbbb.us-west-2.rds.amazonaws.com',
  user     : 'shahanimesh94',
  password : 'shahanimesh94',
  port     : '3306',
  database : 'olympic_quiz'
});

router.get('/get_leaders', function(req, res) {
    leaderboard.find({"mode": "Easy"}, function (err, Easy) {
        if (err) {
            console.log("Mongo Error");
            console.log(err);
        }
        leaderboard.find({"mode": "Medium"}, function (err, Medium) {
            if (err) {
                console.log("Mongo Error");
                console.log(err);
            }
            leaderboard.find({"mode": "Hard"}, function (err, Hard) {
                leaderboard.find({"mode": "Rapid"}, function (err, Rapid) {
                    if (err) {
                        console.log("Mongo Error");
                        console.log(err);
                    }
                    // console.log({"Easy":Easy,"Medium":Medium,"Hard":Hard,"Rapid":Rapid});
                    res.json({"Easy": Easy, "Medium": Medium, "Hard": Hard, "Rapid": Rapid});
                }).sort({"score": -1}).limit(10);
            }).sort({"score": -1}).limit(10);
        }).sort({"score": -1}).limit(10);
    }).sort({"score": -1}).limit(10);
})

    var ddg = require('ddg');

// Remove str2 from str1
var removestr2 = function(str1, str2) {
    return str1.replace(new RegExp(str2, 'g'), " ").trim();
}

router.get('/ddg_hint', function(req, res, next) {
   ddg.query(req.query["correct_answer"], function(err, data) {
       results = data.RelatedTopics; //related topics is a list of 'related answers'

       var text;
       if (data.AbstractText) {
           text = data.AbstractText;
       } else {
           text = results[0].Text;
       }

       res.send(removestr2(text, req.query["correct_answer"]));
   });
});

router.get('/quiz_list', function(req, res, next) {
  MongoClinet.connect(url, function(err, db) {
    if (err) throw err;

    // console.log(req.query['total_questions']);
    var questions = db.collection('questions');
    questions.aggregate([ { $sample: { size: parseInt(req.query['total_questions'])} }, {$project:{_id: 1}}]).toArray(function (err, docs) {
          // console.log(docs);
        res.json(docs);
        db.close();
    });
  });
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
        res.json({"question":obj['question'],
          "answer":[row[0], options[0],options[1],options[2]]});
      });
    });
  });

  MongoClinet.connect(url, function(err, db) {
    var questions = db.collection('questions');
      console.log(req.query);
    questions.findOne({_id: ObjectId(req.query.question_id)}, function(err, obj) {
        if(err) {
            console.log("Mongo Error");
            console.log(err);
        }
        if (obj) {
            flowController.emit('dowork', obj);
        } else {
            console.log("No Result");
            // flowController.emit('dowork', obj);
        }
    })
  })

  flowController.on('finished', function () {
    console.log('finished');
  });
});

router.get('/newquestion/validateRightSql', function(req, res){
    connection.query(req.query['RightSql'], function(err, row) {
        if(err) {
            res.status(500).send(err);
            return;
        }
        if(row.length != req.query['Requiredlength']) {
            res.status(500).send("There Should be ".concat(req.query['Requiredlength']) + " Correct Answer whereas \n I got: ".concat(row.length.toString()).concat(" answers"));
            return;
        }
        console.log(row);
        res.status(201).send(row);
    })
});

router.post('/newquestion/addquiz', function(req, res, next) {
    MongoClinet.connect(url, function(err, db) {
        db.collection("questions").insertOne(req.body, function(err, result) {
            // console.log(err);
            db.close();
        });
    });
});

module.exports = router;
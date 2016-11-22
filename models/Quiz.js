var mongoose = require('mongoose');

var QuizSchema = new mongoose.Schema({
    questionquery: String,
    question: String,
    q_id: String,
    options: String
});

mongoose.model('Quiz', QuizSchema, 'questions');
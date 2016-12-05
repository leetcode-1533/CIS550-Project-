/**
 * Created by kirasev on 12/4/2016.
 */

var mongoose = require('mongoose');

var user_score = new mongoose.Schema({
    user_id: String,
    score: String,
    mode: String,
});

mongoose.model('leaderboard', user_score, 'users');
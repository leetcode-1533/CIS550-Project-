/**
 * Created by Dell on 12/2/2016.
 */
var infobox = require('wiki-infobox');
var mysql = require('mysql');

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'me',
    password : 'secret',
    database : 'my_db'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows[0].solution);
});

connection.end();



var connection = mysql.createConnection({
    host     :  'olympicquiz.cziypygdpbbb.us-west-2.rds.amazonaws.com',
    user     : 'shahanimesh94',
    password : 'shahanimesh94',
    port     : '3306',
    database : 'olympic_quiz'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows[0].solution);
});

connection.end();



count_query="Select count(*) from Athlete;";
db.query(count_query, function(err, athlete_count) {
    if (err) console.log(err);
});




for (i = 1; i < athlete_count; i++)
{
    quer = "Select * from Athlete WHERE id+"+i+";";
    db.query(quer, function(err, rows, fields) {
        if (err) console.log(err);
    });
    console.log(rows, fields);
}



var page = 'antonios Pepanos';
var language = 'en';

infobox(page, language, function(err, data) {
    if (err) {
        // Oh no! Something goes wrong!
        return;
    }

    console.log(data);
});

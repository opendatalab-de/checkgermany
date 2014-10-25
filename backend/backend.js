/**
 * Created by Felix on 25.10.14.
 */

/**
 * Requirements for database and node.js
 * @type {exports}
 */
var http = require('http');
var mongoose = require('mongoose');
var express = require('express');
var app = express();

/**
 * TODO Build up the url with given parameters
 */
var url = 'http://api.regenesis.pudo.org/cube/';

var createUrl = function(tc, y){
    url += tc + '/' + 'aggregate?cut=jahr.text:' + y;
};

/**
 * TODO Connecting with mongoDB
 */
var connect = mongoose.connect('mongodb://localhost/checkgermany');
if(connect)
    console.log('connected');
else
    console.log('not connected');

/**
 * Call function creatUrl to edit the data request of regenesis
 */

/**
 * TODO Get data from regenesis server
*/
app.get('/data', function(req, res){
    console.log(req);

    var tableString = req.query.table;
    var year = req.query.year;

    createUrl(tableString, year);

    http.get(url, function(resolution) {
        var body = '';
        resolution.on('data', function(chunk) {
            body += chunk;
        });

        resolution.on('end', function() {
            var response = JSON.parse(body);
            console.log("Got response: ", response);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
});

app.listen(8080);


/**
 * TODO Get parameter from front
 */


///**
// * TODO Save data set into table
// */
//var kitty = new Cat({ name: 'Zildjian' });
//kitty.save(function (err) {
//    if (err) // ...
//        console.log('meow');
//});
////TODO solange daten in datenset; sichere diese in datenbank
//
///**
// * Update data set in table
// */
//
//// TODO prüfe ob daten aktuell; wenn nicht aktualisiere diese
//
///**
// * Create table for data
// */
//var Cat = mongoose.model('Cat', { name: String });
//// TODO erstelle tabelle für daten;

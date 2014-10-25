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
    url += tc + '/' + 'aggregate?cut=jahr.text:' + y + '&drilldown=gemein';
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
 * TODO Filter data with parameters
 * TODO Create new object with reduced datas
*/
app.get('/data', function(req, res){
    console.log(req);

    var tableString = req.query.table;
    var year = req.query.year;
    var filter = req.query.fieldName;

    createUrl(tableString, year);

    http.get(url, function(resolution) {
        var body = '';
        resolution.on('data', function(chunk) {
            body += chunk;
        });
        console.log(url);
        resolution.on('end', function() {
            var response = JSON.parse(body);
            var convResult =[];
            response.cells.forEach(function(entry) {
                var entryOfResult = {
                    'id': entry['gemein.label'],
                    'rs': entry['gemein.name']
                };
                entryOfResult[filter] = entry[filter];
                convResult.push(entryOfResult);
            });
            console.log(convResult);

        //console.log("Got response: ", response);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
});

app.listen(8080);

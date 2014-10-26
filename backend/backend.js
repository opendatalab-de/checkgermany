/**
 * Created by Felix on 25.10.14.
 */

/*jshint strict:false */

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
 * TODO Get data from regenesis server
 * TODO Filter data with parameters
 * TODO Create new object with reduced data
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
            return convResult;
        //console.log("Got response: ", response);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
});

/**
 * TODO Get request for the embeded code
 * TODO Save request with result in database
 * TODO Read request out of database and send it as embeded code
 */
app.post('body', function(req, res){
    var body = req.body;
    saveData(body);
    readData(body);
});

app.listen(8080);

/**
 * TODO Connecting with mongoDB
 */
var connect = mongoose.connect('mongodb://localhost/checkgermany');
if(connect){
    console.log('connected');
    var cgSchema = mongoose.Schema({
        name: String
    });
    var embeddedCode = mongoose.model('embedded', cgSchema);
}else
    console.log('not connected');

/**
 * TODO Save data into the database
 */
var saveData = function(data){
    embeddedCode.insert({embedded: data}, function (err) {
        if (err)
            return console.error(err);
        else{
            return embeddedCode.find({embedded:data}, {_id: 1}, function(err){
                if(err) return console.error(err);
            });
        }
    });
};

/**
 * TODO Read data out of database
 */
var readData = function(id){
    embeddedCode.find({_id: id}, function (err) {
        if (err) return console.error(err);
        return this;
    });
};

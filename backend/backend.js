/**
 * Created by Felix on 25.10.14.
 */

/**
 * Requirements for database and node.js
 * @type {exports}
 */
var http = require('http');
var mongoose = require('mongoose');

/**
 * TODO Build up the url with given parameters
 */
var url = 'http://api.regenesis.pudo.org/cube/';

tc = '71231gj001';
y = '2008';

var createURL = function(tc, y, rs, fn){
   url += tc + '/' + 'aggregate?cut=jahr.text:' + y;
};

http://api.regenesis.pudo.org/cube/71231gj001/aggregate?cut=jahr.text:2008&drilldown=gemein

/**
 * TODO Connecting with mongoDB
 */
var connect = mongoose.connect('mongodb://localhost/checkgermany');
if(connect)
    console.log('connected');
else
    console.log('not connected');

/**
 * Get data from regenesis server
*/

http.get(url, function(res) {
    var body = '';
    res.on('data', function(chunk) {
        body += chunk;
    });

    res.on('end', function() {
       var response = JSON.parse(body);
        console.log("Got response: ", response);
    });
}).on('error', function(e) {
    console.log("Got error: ", e);
});

/**
 * TODO Creating an JSON Object of data
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


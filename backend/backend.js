/**
 * Created by Felix on 25.10.14.
 */

/**
 * TODO Connecting with mongoDB
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

/**
 * TODO Get data from regenesis server
 */
http.get("http://api.regenesis.pudo.org/model", function(data) {
    console.log("Got response: " + data.statusCode);
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});

/**
 * TODO Save data set into table
 */
var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
    if (err) // ...
        console.log('meow');
});
//TODO solange daten in datenset; sichere diese in datenbank

/**
 * Update data set in table
 */

// TODO prüfe ob daten aktuell; wenn nicht aktualisiere diese

/**
 * Create table for data
 */
var Cat = mongoose.model('Cat', { name: String });
// TODO erstelle tabelle für daten;


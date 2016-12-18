"use strict";
const fs = require('fs');
const generatorData = JSON.parse(fs.readFileSync('gemeinde-data-generators.json', {encoding: 'UTF-8'}));
const httpsData = JSON.parse(fs.readFileSync('https-city.json'));
const geojson = JSON.parse(fs.readFileSync('gemeinden_sim0.geojson', {encoding: 'UTF-8'}));

const addGeneratorData = function (entry) {
    const ags = entry.properties.AGS;
    const generatorDataEntry = generatorData.find(function (generatorEntry) {
        return generatorEntry.ags == ags;
    });
    if (!generatorDataEntry) {
        entry.properties.generatorColor = '#E0E0E0';
        return true;
    }
    entry.properties.domain = generatorDataEntry.domain;
    entry.properties.website = generatorDataEntry.website;
    entry.properties.generator = generatorDataEntry.generator;
    entry.properties.generatorBrand = generatorDataEntry.generator.split(' ')[0];
    entry.properties.generatorColor = generatorDataEntry.properties.fill;
};

const addHttpsData = function (entry) {
    var httpsDataEntry = null;
    if (entry.properties.domain) {
        httpsDataEntry = httpsData.find(function (httpsEntry) {
            return httpsEntry.Domain == entry.properties.domain;
        });
    } else {
        httpsDataEntry = httpsData.find(function (httpsEntry) {
            return httpsEntry.Agency == entry.properties.GEN;
        });
    }
    if (!httpsDataEntry) return true;
    if (httpsDataEntry['Uses HTTPS'] === 'Yes') {
        entry.properties.https = 'yes';
        if (httpsDataEntry['Enforces HTTPS'] === 'Yes') {
            entry.properties.https = 'yes-force';
        }
    } else {
        entry.properties.https = 'no';
    }
};

geojson.features.forEach(function (entry) {
    addGeneratorData(entry);
    addHttpsData(entry);
});

fs.writeFileSync('communes.geojson', JSON.stringify(geojson), {encoding: 'UTF-8'});

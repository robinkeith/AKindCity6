#!/usr/bin/env node
//const dataSets = require( './norwich.js');
//import {norwichMapOSM} from './norwich.mjs';
//import 'fs';
//import * as queryOverpass from 'query-overpass';
//queryOverpass = require('query-overpass');

const fs = require('fs'),
    queryOverpass = require('query-overpass'),
    norwichMapOSM = require( './norwich.js');

const bbox='52.578228,1.171761,52.693864,1.525726';

norwichMapOSM.forEach(function(dataset){
    osmtoGeoJSONfile(bbox, dataset.query,`./data/${dataset.name}.geojson`);
})


//osmtoGeoJSONfile(bbox,'nwr["amenity"="police"];','./output/test1.geojson');



function osmtoGeoJSONfile(bbox,query,filename){
    console.log(`Extracting ${filename}`);
    let fullQuery=`[bbox:${bbox}][out:json][timeout:300];(${query});out body;>;out skel qt;`;

    var req = queryOverpass(fullQuery,
        function(err, geojson) {
            if (err) { 
                console.log(`${filename} - Query failed: ${fullQuery}`);
                return; 
            }
            console.log(`${filename} - Query executed ok, returned ${geojson.features.length} features` );
            toFile(geojson,filename);
        },
        {flatProperties:true}
        );
    }


function toFile(obj, filename){
    let jsonContent = JSON.stringify(obj,null," ");
    //console.log(jsonContent);
        
    fs.writeFile(filename, jsonContent, 'utf8', function (err) {
        if (err) {
            console.log(`${filename} - Error while attempting to save:`);
            return console.log(err);
        }
        
        console.log( filename + " has been saved.");
    });
}
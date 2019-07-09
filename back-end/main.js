#!/usr/bin/env node
// const dataSets = require( './norwich.js');
// import {norwichMapOSM} from './norwich.mjs';
// import 'fs';
// import * as queryOverpass from 'query-overpass';
// queryOverpass = require('query-overpass');

const fs = require('fs')
const queryOverpass = require('query-overpass')
const norwichMapOSM = require('./norwich.js')
const postProcess = require('./postProcess.js')

const bbox = '52.578228,1.171761,52.693864,1.525726'


/* Mode 1 do eveything in the city array */
/*
norwichMapOSM.forEach(function (dataset) {
  osmtoGeoJSONfile(bbox, dataset.query, `./data/${dataset.name}.geojson`)
})
*/
/* Mode 2 just process one file */
const testGeoJson = JSON.parse(fs.readFileSync('./data/enjoy.geojson', 'utf8')) // May be incorrect, haven't used fs in a long time
let res = postProcess.postProcess(testGeoJson)
console.log(res)
toFile(res, './data/output.geojson')

/**
 * Query OSM via overpass and convert the resulting OSM format data to geoJSON.
 * Apply post processing and save the resulting geoJSON to a file
 * @param {*} bbox  Bounding box, the area the query is restricted to
 * @param {*} query The OverPass QL to retrieve map features
 * @param {*} filename Filename of the outpt file
 */
function osmtoGeoJSONfile (bbox, query, filename) {
// Full overpass QL query, with timeout and format parameter
// Also with output statement
// out tags center; is probably a better choice as it collapses ways into points
const fullQuery = `[bbox:${bbox}][out:json][timeout:300];(${query});out body;>;out skel qt;`



  console.log(`Extracting ${filename}`)
  

  queryOverpass(fullQuery,
    function (err, geojson) {
      if (err) {
        console.log(`${filename} - Query failed: ${fullQuery}`)
        return
      }
      console.log(`${filename} - Query executed ok, returned ${geojson.features.length} features`)
      postProcess(geojson)
      toFile(geojson, filename)
    },
    { flatProperties: true }
  )
}
/**
 * Save an object to a named file
 * @param {*} obj Any js object
 * @param {*} filename full path and name of destination file
 */
function toFile (obj, filename) {
  let jsonContent = JSON.stringify(obj, null, ' ')
  // console.log(jsonContent);

  fs.writeFile(filename, jsonContent, 'utf8', function (err) {
    if (err) {
      console.log(`${filename} - Error while attempting to save:`)
      return console.log(err)
    }

    console.log(filename + ' has been saved.')
  })
}

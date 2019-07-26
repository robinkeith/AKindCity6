#!/usr/bin/env node
// const dataSets = require( './norwich.js');
// import {norwichMapOSM} from './norwich.mjs';
// import 'fs';
// import * as queryOverpass from 'query-overpass';
// queryOverpass = require('query-overpass');

// import { readFileSync, writeFile } from 'fs'
import queryOverpass from 'query-overpass'
import { filter } from './norwich.js'
import { postProcess as _postProcess } from './postProcess.js'
const fs = require('fs')

const bbox = '52.578228,1.171761,52.693864,1.525726'
const modeDownload = true
const modePostProcess = !modeDownload
const modeDatasetsToProcess = [] // ['around-crossings']
// const modeEverything = true

function slowIterate (arr, timeout, cb) {
  if (arr.length === 0) {
    return
  }
  cb(arr[0])
  setTimeout(() => {
    slowIterate(arr.slice(1), timeout, cb)
  }, timeout) // <-- replace with your desired delay (in milliseconds)
}

let selectedDatasets = filter(dataset => modeDatasetsToProcess.includes(dataset.name))
/*
selectedDatasets.reduce( async (previousPromise, nextID) => {
  await previousPromise;
  return methodThatReturnsAPromise(nextID);
}, Promise.resolve());
*/

// TODO:sort out the async processing
if (modeDownload) {
/* Mode 1 down load the data from OSM - but don't post process */
  slowIterate(selectedDatasets, 5000, function (dataset) {
    if (dataset.query) {
      osmtoGeoJSONfile(bbox, dataset.query, `./temp/data/${dataset.name}.geojson`)
    }
  })
}

if (modePostProcess) {
  selectedDatasets.forEach(function (dataset) {
    let data = JSON.parse(fs.readFileSync(`./temp/data/${dataset.name}.geojson`, 'utf8'))
    let res = _postProcess(data, dataset)
    console.log(res)
    toFile(res, `./data/${dataset.name}.geojson`)
  })
}

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
  // const fullQuery = `[bbox:${bbox}][out:json][timeout:300];(${query});out body;>;out skel qt;`
  let fullQuery = `[bbox:${bbox}][out:json][timeout:1600];`
  if (query.includes('out ')) {
    fullQuery += query
  } else {
    fullQuery += `(${query}); out tags center;`
  }

  console.log(`Extracting ${filename} with query "${fullQuery}"`)

  queryOverpass(fullQuery,
    function (err, geojson) {
      if (err) {
        console.error(`${filename} - Query failed: ${fullQuery} - ERROR: ${err.statusCode} ${err.message}`)
        return
      }
      console.log(`${filename} - Query executed ok, returned ${geojson.features.length} features`)
      // postProcess.postProcess(geojson)
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

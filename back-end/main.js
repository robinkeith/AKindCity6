#!/usr/bin/env node
const queryOverpass = require('query-overpass')
const norwichMapOSM = require('./norwich.js')
const postProcess = require('./postProcess.js')
const fs = require('fs')
const jsonexport = require('jsonexport')

const bbox = '52.578228,1.171761,52.693864,1.525726'
const modeDownload = true
const modePostProcess = true // !modeDownload
const modeDatasetsToProcess = [] // ['shop']// 'help-services']

function slowIterate (arr, timeout, cb) {
  if (arr.length === 0) {
    return
  }
  cb(arr[0])
  setTimeout(() => {
    slowIterate(arr.slice(1), timeout, cb)
  }, timeout) // <-- replace with your desired delay (in milliseconds)
}

let selectedDatasets = (modeDatasetsToProcess.length === 0) ? norwichMapOSM
  : norwichMapOSM.filter(dataset => modeDatasetsToProcess.includes(dataset.name))

// TODO:sort out the async processing
if (modeDownload) {
/* Mode 1 down load the data from OSM - but don't post process */
  slowIterate(selectedDatasets, 5000, function (dataset) {
    if (dataset.query) {
      osmtoGeoJSONfile(bbox, dataset)
    }
  })
} else {
  selectedDatasets.forEach(function (dataset) {
    let data = JSON.parse(fs.readFileSync(`./temp/data/${dataset.name}.geojson`, 'utf8'))
    processRawGeoJSON(data, dataset)
  })
}

function processRawGeoJSON (data, dataset) {
  let res = postProcess.postProcess(data, dataset)
  console.log(res)
  toJSONFile(res, `./data/${dataset.name}.geojson`)
  toCSVFile(res, `./temp/data/${dataset.name}.csv`)
}

/**
 * Query OSM via overpass and convert the resulting OSM format data to geoJSON.
 * Apply post processing and save the resulting geoJSON to a file
 * @param {*} bbox  Bounding box, the area the query is restricted to
 * @param {*} query The OverPass QL to retrieve map features
 * @param {*} filename Filename of the outpt file
 */
function osmtoGeoJSONfile (bbox, dataset) {
// Full overpass QL query, with timeout and format parameter
// Also with output statement
// out tags center; is probably a better choice as it collapses ways into points
  // const fullQuery = `[bbox:${bbox}][out:json][timeout:300];(${query});out body;>;out skel qt;`

  let query = dataset.query
  let filename = `./temp/data/${dataset.name}.geojson`
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
      if (modePostProcess) {
        processRawGeoJSON(geojson, dataset)
      }
    },
    { flatProperties: true }
  )
}

/**
 * Save an object to a named file
 * @param {*} obj Any js object
 * @param {*} filename full path and name of destination file
 */
function toJSONFile (obj, filename) {
  let jsonContent = JSON.stringify(obj, null, ' ')
  // console.log(jsonContent);

  fs.writeFile(filename, jsonContent, 'utf8', function (err) {
    if (err) {
      console.log(`${filename} - Error while attempting to save:`)
      return console.error(err)
    }

    console.log(filename + ' has been saved.')
  })
}

/**
 * Save an object to a named file
 * @param {*} obj Any js object
 * @param {*} filename full path and name of destination file
 */
function toCSVFile (obj, filename) {
  jsonexport(obj.features, {
    verticalOutput: true,
    mapHeaders: (header) => header.replace(/properties\./, '').replace(/mapFeature\./, 'F.') },
  function (err, output) {
    if (err) return console.log(err)
    // console.log(filename)
    fs.writeFile(filename, output, 'utf8', function (err) {
      if (err) {
        console.log(`${filename} - Error while attempting to save:`)
        return console.error(err)
      }

      console.log(filename + ' has been saved.')
    })
  })

/*  stringify(obj,
    {
      header: true
    },
    function (err, output) {
      if (err) {
        console.log(`${filename} - Error while attempting to save:`)
        return console.log(err)
      }
      fs.writeFile(filename, output, 'utf8', function (err) {
        if (err) {
          console.log(`${filename} - Error while attempting to save:`)
          return console.log(err)
        }

        console.log(filename + ' has been saved.')
      })
    }) */
}

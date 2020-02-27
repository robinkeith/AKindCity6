// ESM syntax is supported.
import queryOverpass from 'query-overpass'
import norwichMapOSM from './norwich.js'
import postProcess from './postProcess.js'
import fs from 'fs'
import jsonexport from 'jsonexport'
// import {log} from './lib/logging'
const dataDirectory = './../data/'
const rawDirectory = dataDirectory + 'raw'
const csvDirectory = dataDirectory + 'csv'
const processedDirectory = dataDirectory + ''
// const originalsDirectory = dataDirectory + 'original'

// TODO: allow the bbox, downloadmode and data sets to be passed in as command line args
const bbox = '52.578228,1.171761,52.693864,1.525726'
const modeDownload = false
const modePostProcess = true
const modeDatasetsToProcess = ['all']// 'help-services']

console.log('START')
main()

function main () {
// console.log('START')
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
      try {
        let data = JSON.parse(fs.readFileSync(`${rawDirectory}/${dataset.name}.geojson`, 'utf8'))
        processRawGeoJSON(data, dataset)
      } catch (error) {
        console.error(`Unable to process '${dataset.name}'. Error ${error}`)
      }
    })
  }
}
/**
 * Iterate over an array, introducing pauses between calls to avoid overloading the endpoint
 * @param {Array} arr The array to iterate over
 * @param {number} timeout length of the pause (ms)
 * @param {Function} cb Callback function
 * @returns void
 */
function slowIterate (arr, timeout, cb) {
  if (arr.length === 0) {
    return
  }
  cb(arr[0])
  setTimeout(() => {
    slowIterate(arr.slice(1), timeout, cb)
  }, timeout) // <-- replace with your desired delay (in milliseconds)
}

/**
 * Query OSM via overpass and convert the resulting OSM format data to geoJSON.
 * Apply post processing and save the resulting geoJSON to a file
 * @param {string} bbox  Bounding box, the area the query is restricted to
 * @param {Object} dataset properties of this dataset
 */
function osmtoGeoJSONfile (bbox, dataset) {
// Full overpass QL query, with timeout and format parameter
// Also with output statement
// out tags center; is probably a better choice as it collapses ways into points
  // const fullQuery = `[bbox:${bbox}][out:json][timeout:300];(${query});out body;>;out skel qt;`

  let query = dataset.query
  let filename = `${rawDirectory}/${dataset.name}.geojson`
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
      toJSONFile(geojson, filename)
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
 * @param {Array<Object>} arr An array of objects
 * @param {string} filename full path and name of destination file
 */
function toCSVFile (arr, filename) {
  jsonexport(arr, {
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
}

/**
 * Perform stats analysis on an array of objects to determine:
 * The frequency of each property (ie the number of elements that contain that property)
 * A list of unique values for the property (capped at 100)
 * A count of the number occrances of each value.
 * @param {Array<Object>} arr Array of objects to analyse
 * @return {Object} Object where each property represents a field in the main dataset,
 * with a count of the number of times the property occurs,
 * and a list of the unique field values and the counts of those values
 */
function analyseTagFrequency (arr) {
  let analysis = arr.reduce((acc, current) => {
    let tags = current.properties
    let p = Object.entries(tags)

    p.forEach((propValue, index, array) => {
      let prop = propValue[0]
      let value = propValue[1]

      // if (!ignore.includes(prop)) {
      if (!acc[prop]) {
        acc[prop] = { count: 1, uniqueValuesCount: 0, values: {} }
      } else {
        acc[prop].count++
      }
      if (!acc[prop].values[value]) {
        acc[prop].values[value] = 1
        acc[prop].uniqueValuesCount++
      } else {
        acc[prop].values[value]++
      }
      // }
    })
    return acc
  },
  {})

  return analysis
}

function analyseResults (analysis) {
  // Make the analysis more useful by calculating the most

  return {
    tagsByFrequency: Object.entries(analysis).sort((a, b) =>
      b[1].count - a[1].count)

  }
}

/**
 * Process a whole geoJSON data file
 * @param {Object} data geoJson file object
 * @param {Object} dataset configuration object
 * @returns void
 */
function processRawGeoJSON (data, dataset) {
  // const propsToIgnore = 'id,name,addr:postcode,addr:street,addr:housenumber,phone,capacity,fee'.split(',')

  let stats = analyseTagFrequency(data.features)
  let summary = analyseResults(stats)

  toJSONFile(stats, `${csvDirectory}/${dataset.name}_stats.json`)
  toJSONFile(summary, `${csvDirectory}/${dataset.name}_summary.json`)

  // return
  let res = postProcess(data, dataset)
  toJSONFile(res, `${processedDirectory}/${dataset.name}.geojson`)
  toCSVFile(res.features, `${csvDirectory}/${dataset.name}.csv`)
}

/**
 * what stats are useful?
 * how many features in total
 * fequency of primary tags
 *
 *
 */

// import * as turf from '@turf/turf'
// const titleCase = require('better-title-case')
// const turf = require('@turf/turf')
// const dataFormat = require('../src/dataFormat.js')
import * as turf from '@turf/turf'
import * as dataFormat from './dataFormat.js'

/*
const layerHere = 'here'
const layerAround = 'around'
const layerToilets = 'toilets'
const layerFood = 'food'
const layerShop = 'shop'
const layerEnjoy = 'enjoy'
const layerHelp = 'help'

/** Loop through the elements of the array.
 *  Filter ony elements that should be excluded(?)
 *
*/
// module.exports.postProcess = function (geojson, dataset) {
/**
 * Apply post processing to a geoJson file
 * @param {Object} geojson Whole geoJson object multiple features)
 * @param {Object} dataset config of whoe the ecords should be processed
 * @returns Object
 */
export default function postProcess (geojson, dataset) {
  // reduce is used to filter and map the array of features at the same time to avoid two passes
  geojson.features = geojson.features.reduce(
    (accumulator, feature) => {
      let processedFeature = processFeature(feature, dataset)
      if (processedFeature) {
        accumulator.push(processedFeature)
      }
      return accumulator
    },
    []
  )
  return geojson
}

/* For the map, we are looking for the following properties
name - displayed as the caption
location - building, street, level, postcode
         - and for some data types description of how to get to the place within a large building
description - text description, including pretified versions of the tags where possible.
opening_hours - enough info to determine if the place is open curently, and when it's next open
access - flags and info that allow us to decide if the place is accessible
    to the current personalisation flags
ownership - who runs the place and how to contact them
data quality and supply - who supplied the data, and when

Map marker to use (may need to be a function)
*/

/**
 * Process a feature. Return either a processed feature or undefined if the feature is to be removed.
 * @param {*} feature The feature to be processed
 * @returns {*}
 */
function processFeature (feature, dataset) {
  // 1. collapse the geometry into a single point
  feature = collapseGeometryToPoint(feature)

  createMapFeature(feature, dataset)

  return feature
}

/**
 * Generate a mapFeature property for the feature, which will be used by the map to display the marker more efficiently.
 * @param {Object} feature the feature in question
 * @param {Object} dataset Configuration for the dataset
 */
function createMapFeature (feature, dataset) {
  let tags = dataFormat.tidyTags(feature.properties)
  let mapFeature = { layers: dataFormat.layers(tags) }
  if (tags.amenity && tags.amenity === 'vending_machine' && tags.vending && tags.vending === 'parking_tickets') {
    Object.assign(mapFeature, { hoverCaption: 'On-road Parking Bay', allowPopup: false, icon: 'parkingMeter' })
  } else if (tags.highway && (tags.highway === 'crossing' || tags.highway === 'traffic_signals')) {
    let { caption, rating } = describeCrossing(tags)
    Object.assign(mapFeature, { hoverCaption: caption, allowPopup: false, icon: 'crossing_' + rating })
  } else {
    Object.assign(mapFeature, {
      caption: dataFormat.caption(tags),
      allowPopup: true,
      icon: dataFormat.icon(tags),
      location: dataFormat.location(tags),
      description: dataFormat.description(tags),
      facilities: dataFormat.facilities(tags),
      availability: dataFormat.availability(tags),
      contact: dataFormat.contacts(tags),
      meta: dataFormat.meta(tags)
      // layers: dataFormat.layers(tags)
    })
  }

  feature.properties.mapFeature = mapFeature
}

/**
 * Describe a road crossing feature
 * @param {Object} tags OSM properties
 * @return Object
 */
function describeCrossing (tags) {
  let caption
  let score = 0

  const bHasTactile = (tags['tactile_paving'] && tags['tactile_paving'] === 'yes')
  const bHasAudio = (tags['traffic_signals:sound'] &&
                    (tags['traffic_signals:sound'] === 'yes' || tags['traffic_signals:sound'] === 'walk'))
  const bHasPedestrianSensor = (tags['pedestrian_sensor'] && tags['pedestrian_sensor'] === 'yes')

  if (bHasAudio) score++
  if (bHasTactile) score++
  if (bHasPedestrianSensor) score++

  return { caption, score }
}

/**
 * Reduce a geoJSON geometry to a single point that can be placed on a map.
 * Reduces LineString , Polygon , MultiPoint , MultiLineString , and MultiPolygon
 * @param {Object} feature
 * @returns feature with geometry replaced by single point
 */
function collapseGeometryToPoint (feature) {
  let geometry = feature.geometry

  if (geometry.type !== 'Point') {
    let featureCentroid = turf.centroid(feature)
    feature.geometry = { type: 'Point', coordinates: featureCentroid.geometry.coordinates }
    // tags.type = 'point'
  }
  return feature
}
/*
// return a labelled value if the value is valid, nothing otherwise
function label (tags, valueName, postValue, postLabel) {
  let value = ''

  try {
    value = tags[valueName]
  } catch (error) {

  }

  if (!value) { return '' }
  // look for any overrides or improvements and apply them if found
  let dataImprovement = dataImprover[valueName]
  let prettyLabel, prettyValue
  // let improverType = typeof (dataImprovement)
  switch (typeof (dataImprovement)) {
    case 'string':
      prettyLabel = dataImprovement
      prettyValue = value
      break
    case 'object':
      prettyLabel = dataImprovement.label
      prettyValue = dataImprovement.value(value)
      break
    default:
      prettyLabel = titleCase(valueName.replace(/[:|-|_]/gi, ' '))
      prettyValue = value
  }

  // console.log(prettyLabel,prettyValue);
  let ret =
         ((prettyLabel) ? `<strong>${prettyLabel}:</strong>&nbsp;` + (postLabel || '') : '') +
         prettyValue +
         ((postValue) || '')

  return ret
}
*/

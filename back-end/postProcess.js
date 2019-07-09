// import * as turf from '@turf/turf'
const turf = require('@turf/turf')

/** Loop through the elements of the array.
 *  Filter ony elements that should be excluded(?)
 *
*/
module.exports.postProcess = function (geojson) {
  geojson.features = geojson.features.reduce(
    (accumulator, feature) => {
      let processedFeature = processFeature(feature)
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
function processFeature (feature) {
  // 1. collapse the geometry into a single point
  feature = collapseGeometryToPoint(feature)
  // 2. Tidy up the name

  // 3. ...
  // if (feature.properties.leisure === 'golf_course') {
  //  return false
  // }
  // feature.properties.name = (feature.properties.name || 'NEW') + 'some name'
  return feature
}

/**
 * Reduce a geoJSON geometry to a single point that can be placed on a map.
 * Reduces LineString , Polygon , MultiPoint , MultiLineString , and MultiPolygon
 * @param {*} feature
 */
function collapseGeometryToPoint (feature) {
  let geometry = feature.geometry

  if (geometry.type !== 'Point') {
    let featureCentroid = turf.centroid(feature)
    feature.geometry = { type: 'Point', coordinates: featureCentroid.geometry.coordinates }
    feature.properties.type = 'point'
  }
  return feature
}

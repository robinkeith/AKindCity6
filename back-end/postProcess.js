// import * as turf from '@turf/turf'
const turf = require('@turf/turf')

const layerHere = 'here'
const layerAround = 'around'
const layerToilets = 'toilets'
const layerFood = 'food'
const layerShop = 'shop'
const layerEnjoy = 'enjoy'
const layerHelp = 'help'

let dataImprover = {
  'capacity:disabled': 'Number of Blue Badge spaces',
  'capacity:parent': 'Number of Parent and Child spaces',
  'fee:amount:per_hour': 'Carpark Charge (per hour)',
  'fee:amount': 'Carpark Charge',
  'centralkey': 'RADAR Key Required',
  'access': 'Access',
  'kitchen_hours': 'Kitchen Opening Times',
  'opening_hours': 'Opening Times',
  'addr:housenumber': '',
  'addr:street': '',
  'addr:postcode': '',
  'level': 'Level',
  'description': '',
  'wheelchair:description': '',
  'wheelchair': { label: '',
    value: function (tagValue) {
      switch (tagValue) {
        case 'no':return 'NO WHEELCHAIR ACCESS'
        case 'yes':return 'Wheelchair accessible'
        case 'limited':return 'Limited wheelchair access'
        default:return ''
      }
    } },
  'toilets:wheelchair': 'Wheelchair Accessible Toilets',
  'fee:charge': 'Fee',
  'operator': 'Operated By'
}

/** Loop through the elements of the array.
 *  Filter ony elements that should be excluded(?)
 *
*/
module.exports.postProcess = function (geojson, dataset) {
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
 * Generate a mapFeature property for the feature, which will be used by the map to display the pointer more efficiently.
 * @param {*} feature the feature in question
 */
function createMapFeature (feature, dataset) {
  let tags = tidyTags(feature.properties)
  let mapFeature
  if (tags.amenity && tags.amenity === 'vending_machine' && tags.vending && tags.vending === 'parking_tickets') {
    mapFeature = { hoverCaption: 'On-road Parking Bay', allowPopup: false, icon: 'parkingMeter' }
  } else if (tags.highway && (tags.highway === 'crossing' || tags.highway === 'traffic_signals')) {
    let { caption, rating } = describeCrossing(tags)
    mapFeature = { hoverCaption: caption, allowPopup: false, icon: 'crossing_' + rating }
  } else {
    mapFeature = {
      caption: tidyName(tags),
      allowPopup: true,
      icon: undefined,
      location: tidyLocation(tags),
      facilities: undefined,
      availability: undefined,
      operator: undefined,
      contact: undefined,
      meta: undefined
    }
  }
  mapFeature.layers = dataset.layers
  feature.properties.mapFeature = mapFeature
}

function describeCrossing (tags) {
  let caption, rating

  const bHasTactile = (tags['tactile_paving'] && tags['tactile_paving'] === 'yes')
  const bHasAudio = (tags['traffic_signals:sound'] &&
                    (tags['traffic_signals:sound'] === 'yes' || tags['traffic_signals:sound'] === 'walk'))
  const bHasPedestrianSensor = (tags['pedestrian_sensor'] && tags['pedestrian_sensor'] === 'yes')

  let score = 0
  if (bHasAudio) score++
  if (bHasTactile) score++
  if (bHasPedestrianSensor) score++

  //  rating = 'green'
  // } else {
  //  rating = 'amber'
  // }

  return { caption, rating }
}

function tidyTags (tags) {
  if (tags.Opening) { tags.opening_hours = tags.Opening }
  if (tags.Name) {
    tags.name = tags.Name
  }
  if (tags.Address) { tags['addr:street'] = tags.Address }
  return tags
}

function tidyName (tags) {
  // return feature.tags.name
  return tags.name || tags['addr:housename'] || tags.amenity || tags.building || tags['id'] || ''
}

function tidyLocation (tags) {
  return `${label(tags, 'addr:housenumber', ' ')} ${label(tags, 'addr:street', ' ')} 
  ${label(tags, 'level', ' ')}${label(tags, 'addr:postcode', ' ')}<br />
  ${label(tags, 'description', '<br />')}
  ${label(tags, 'wheelchair', ' ')}
  ${label(tags, 'wheelchair:description')}`
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
    // tags.type = 'point'
  }
  return feature
}

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

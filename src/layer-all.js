import { layerGroup } from 'leaflet'
// import { CSMLayerFactory } from './utils.js'
// import { UserSettings } from './userSettings.js'

/**
 * @param {*} userSettings
 */
export default function (userSettings) {
  // let featureTags = ''

  /**
     * use a red circle to show potential obstacles, green to show aids
     * @param {any} feature feature object
     */
  /* function chooseIcon (feature) {
    return feature.marker
  }
*/
  return layerGroup([
    // CSMLayerFactory('data/nolicence/help-safePlaces.geojson', featureTags, safePlacesMarker, filterSafePlaces),
    // CSMLayerFactory('data/help-services.geojson', featureTags, policeMarker),
    // CSMLayerFactory('data/all.geojson', featureTags, chooseIcon)
  ])
}

// import { divIcon } from './markers.js'
// import OpeningHours from './opening_hours+deps.min.js'
// import FeatureInfo from './FeatureInfo.js'
/* import { UserSettings } from './userSettings';

var safePlacesMarker = L.icon({
  iconUrl: safePlaceLogo,
  iconSize: [45, 45] // size of the icon
})
*/
//  var svgrect = "<svg xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='20' height='10' fill='#5a7cd2'></rect><rect x='0' y='15' width='20' height='10' fill='#5d52cf'></rect></svg>";

// let svgIcon = `<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="61"/><circle fill="#FFF" cx="74" cy="75" r="{pinInnerCircleRadius}"/></svg>`
/*
let timesUnknownMarker = divIcon('#aaaaaa10')
let openMarker = divIcon('#00ff00')
let openSoonMarker = divIcon('#55aa00')
let closedMarker = divIcon('#ff0000')
let closingSoonMarker = divIcon('#aa5500')

let policeMarker2 = L.icon({
  iconUrl: `<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="61"/><circle fill="#FFF" cx="74" cy="75" r="{pinInnerCircleRadius}"/></svg>`
}) */

/*
var policeMarker = L.ExtraMarkers.icon({
  // icon: 'fa-hand-holding-heart',
  markerColor: 'blue'
  // shape: 'square',
  // prefix: 'fa'
}) */
/*
var greyMarker = L.ExtraMarkers.icon({
  // icon: 'fa-hand-holding-heart',
  markerColor: 'gray'
  // shape: 'square',
  // prefix: 'fa'
})
*/
/*
var medMarker = L.ExtraMarkers.icon({
  // icon: 'fa-hand-holding-heart',
  markerColor: 'green'
  // shape: 'square',
  // prefix: 'fa'
})
*/

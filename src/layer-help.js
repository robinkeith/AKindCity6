import L from 'leaflet'
import { CSMLayerFactory } from './utils.js'

var safePlacesMarker = L.ExtraMarkers.icon({
  icon: 'fa-hand-holding-heart',
  markerColor: 'yellow',
  shape: 'square',
  prefix: 'fa'
})

var policeMarker = L.ExtraMarkers.icon({
  // icon: 'fa-hand-holding-heart',
  markerColor: 'blue'
  // shape: 'square',
  // prefix: 'fa'
})
/*
var medMarker = L.ExtraMarkers.icon({
  // icon: 'fa-hand-holding-heart',
  markerColor: 'green'
  // shape: 'square',
  // prefix: 'fa'
})
*/

export default function (userSettings) {
  let featureTags = ''

  let filterSafePlaces = function (feature) {
    return userSettings.vulnerable
  }

  return L.layerGroup([
    CSMLayerFactory('data/help-safePlaces.geojson', featureTags, safePlacesMarker, filterSafePlaces),
    CSMLayerFactory('data/help-services.geojson', featureTags, policeMarker)
  ])
}

import L from 'leaflet'
import { CSMLayerFactory } from './utils.js'
import safePlaceLogo from './../resources/logos/safe-place-logo.png'

var safePlacesMarker = L.icon({
  iconUrl: safePlaceLogo,
  iconSize: [45, 45] // size of the icon
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
    CSMLayerFactory('data/nolicence/help-safePlaces.geojson', featureTags, safePlacesMarker, filterSafePlaces),
    CSMLayerFactory('data/help-services.geojson', featureTags, policeMarker)
  ])
}

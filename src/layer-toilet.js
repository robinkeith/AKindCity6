import L from 'leaflet'
import { CSMLayerFactory } from './utils.js'
// import { userSettings } from './userSettings.js'
import changingPlacesLogo from './../resources/Changing_Place_logo.svg'

var toiletMarker = L.ExtraMarkers.icon({
  icon: 'fa-toilet',
  markerColor: 'yellow',
  shape: 'square',
  prefix: 'fas'
})
var toiletMarker2 = L.ExtraMarkers.icon({
  icon: 'fa-toilet',
  markerColor: 'yellow',
  shape: 'square',
  prefix: 'fas',
  iconColor: 'black'
})

var changingPlacesMarker = L.icon({
  iconUrl: changingPlacesLogo, // 'resources/Changing_Place_logo.svg',
  iconSize: [45, 45] // size of the icon
})

export default function (userSettings) {
  let featureTags = 'changing_table,unisex,male,female,drinking_water'

  let filter = function (feature) {
    if (userSettings.wheelchair) {
      return (feature.properties['wheelchair'] &&
          (feature.properties['wheelchair'] === 'yes'))
    } else { return true }// && feature.properties.wheelchair === "yes");
  }

  /**
   * choose an appropriate icon based on the feature's properties
   * @param {*} feature feature object
   */
  function chooseIcon (feature) {
    // console.log(feature.tags.name);
    return (feature.tags.name && feature.tags.name.includes('Changing Places')) ? changingPlacesMarker
      : ((feature.tags.amenity === 'toilets') ? toiletMarker : toiletMarker2)
  }

  return L.layerGroup([
    CSMLayerFactory('data/toilets-amenity.geojson', featureTags, chooseIcon, filter),
    CSMLayerFactory('data/toilets-nonAmenity.geojson', featureTags, chooseIcon, filter)
  ])
}

import L from 'leaflet'
import { CSMLayerFactory } from './utils.js'

var cafeMarker = L.ExtraMarkers.icon({
  icon: 'fa-mug-hot',
  markerColor: 'purple',
  shape: 'square',
  prefix: 'fa'
})

var glassMarker = L.ExtraMarkers.icon({
  icon: 'fa-wine-glass-alt',
  markerColor: 'purple',
  shape: 'square',
  prefix: 'fa'

})

var foodMarker = L.ExtraMarkers.icon({
  icon: 'fa-utensils',
  markerColor: 'purple',
  shape: 'square',
  prefix: 'fa'
})

export default function (userSettings) {
  let featureTags = ''

  let filter = function (feature) {
    if (userSettings.wheelchair) {
      return (feature.properties['wheelchair'] &&
                (feature.properties['wheelchair'] === 'yes'))
    } else { return true }
  }

  return L.layerGroup([
    CSMLayerFactory('data/food-bar.geojson', featureTags, glassMarker, filter),
    CSMLayerFactory('data/food-cafe.geojson', featureTags, cafeMarker, filter),
    CSMLayerFactory('data/food-fast_food.geojson', featureTags, foodMarker, filter),
    CSMLayerFactory('data/food-pubs.geojson', featureTags, glassMarker, filter),
    CSMLayerFactory('data/food-resturants.geojson', featureTags, foodMarker, filter)
  ])
}

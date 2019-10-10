import L from 'leaflet'
// import store from 'store2'
import 'leaflet-providers'
import 'leaflet-boundsawarelayergroup'
import 'leaflet-extra-markers'
import { userSettings } from './UserSettings.js'
import defaultSettings from './defaultSettings.js'
import 'leaflet-offline-2'

export function setupBaseLayer (map, userSettings) {
  defaultBaseLayer.addTo(map)
}

const defaultBaseLayer =
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoicm9iaW5rZWl0aCIsImEiOiJjanY5MHJrd2swand1NDRucjk2MnR4ejJ1In0.8f5HJ5ZWoRPbUoWcVjaQpg', {
    maxZoom: defaultSettings.maxZoom,
    minZoom: defaultSettings.minZoom,
    // bounds: defaultSettings.maxBounds, //set at the map level
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  })

/*
const mapboxApiKey = 'pk.eyJ1Ijoicm9iaW5rZWl0aCIsImEiOiJjanY5MHJrd2swand1NDRucjk2MnR4ejJ1In0.8f5HJ5ZWoRPbUoWcVjaQpg'

const pedestrianBaseLayer =
L.tileLayer('https://api.mapbox.com/styles/v1/robinkeith/cjwxqu5ke4f451cp6uyqcuhcj/tiles/256/{z}/{x}/{y}?access_token=' + mapboxApiKey, {
  maxZoom: defaultSettings.maxZoom,
  minZoom: defaultSettings.minZoom,
  bounds: defaultSettings.maxBounds,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
})
*/

// const L.tileLayer.offline();

/* "Roads": defaultBaseLayer,
"Pedestrian": pedestrianBaseLayer,
"High Contrast":L.tileLayer.provider('Stamen.Toner'),
"Alt Map 1":L.tileLayer.provider('Esri.WorldStreetMap'),
"Alt Map 2":L.tileLayer.provider('Esri.WorldTopoMap'),
"Alt Map 3":L.tileLayer.provider('Esri.WorldImagery'),
"Alt Map 4":L.tileLayer.provider('CartoDB.Voyager'),
"Alt Map 5":L.tileLayer.provider('OpenStreetMap.Mapnik'),
"Alt Map 6":L.tileLayer.provider('Thunderforest.Transport'),
"Alt Map 7":L.tileLayer.provider('Thunderforest.TransportDark'),

*/

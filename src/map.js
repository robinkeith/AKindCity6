
import { Map } from 'leaflet'
import { } from './mapLayersControl.js'
import '@bagage/leaflet.restoreview'
import { setupControls } from './mapControls.js'
import { setupBaseLayer } from './mapBaseLayer.js'
import { setupFeatures } from './mapFeaturesLayer.js'

export function setup (defaultSettings, userSettings) {
  let map = new Map('map', {
    boxZoom: false,
    maxBounds: defaultSettings.maxBounds,
    maxZoom: defaultSettings.maxZoom,
    minZoom: defaultSettings.minZoom,
    zoomControl: false
  })

  setupBaseLayer(map, userSettings)
  setupFeatures(map, userSettings)
  setupControls(map, userSettings)

  // add the layers and restore the view
  //let layerControl = createLayers(map, userSettings)

  if (!map.restoreView()) {
    map.setView(defaultSettings.mapCentre, defaultSettings.zoom)
  }

  return map
}

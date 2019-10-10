// import {contributeLayer} from './contribute';
import L from 'leaflet'
import store from 'store2'
// import 'leaflet-edgebuffer'
import 'leaflet-providers'
import 'leaflet-boundsawarelayergroup'
import 'leaflet-extra-markers'
import defaultSettings from './defaultSettings.js'
import 'leaflet-offline-2'
// eslint-disable-next-line no-unused-vars
import { UserSettings } from './UserSettings.js'
// import { latLngBounds } from 'leaflet'

const LAYERS_KEY = 'activeLayers'

/* These are global because they are extending the glocal leaflet object */

/* Extensions to LayerGroup for refreshing the layers and getting a layer from the group by label */
L.LayerGroup.include({
  /**
   * @param {UserSettings} userSettings
   * @returns void
   */
  refreshLayers: function (userSettings) {
    // Iterate all layers in the group
    Object.entries(this._layers).forEach(function (datalayer) {
      datalayer[1].refresh()
    })
  },

  /**
   * @param {string} label
   * @returns layer object with the id of label
   */
  getLayerByLabel: function (label) {
    for (var i in this._layers) {
      if (this._layers[i].id === label) {
        return this._layers[i]
      }
    }
  }

})

/**
 * Extends functionality of the layers control to refresh layers, and handle saving / restoring selected layers from local storage
 */
L.Control.Layers.include({
  refreshLayers: function (userSettings) {
    // Iterate all layers in control
    this._layers.forEach(function (datalayer) {
      // Check if it's an overlay
      if (datalayer.overlay) {
        let subLayer = datalayer.layer
        // if it's a layergroup, iterate each child layer
        if (subLayer._layers) {
          subLayer.refreshLayers(userSettings)
        } else {
          if (subLayer.refresh) { subLayer.refresh() }
        }
        // obj.layer.refresh();
      }
    })
  },
  saveSelectedLayers: function () {
    let activeLayers = []
    // let map=this._map;
    this._layers.forEach((datalayer) => {
      if (this._map.hasLayer(datalayer.layer)) {
        activeLayers.push(datalayer.name)
      }
    }, this)
    // save to local storage
    store.set(LAYERS_KEY, JSON.stringify(activeLayers))
  },
  restoreSelectedLayers: function () {
    if (this._map) {
      let activeLayers = JSON.parse(store.get(LAYERS_KEY)) || defaultSettings.activeLayers
      this._layers.forEach((layer) => {
        if (activeLayers.includes(layer.name)) {
          this._map.addLayer(layer.layer)
        }
      }, this)
    }
  }
})

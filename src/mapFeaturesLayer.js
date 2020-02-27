/**
 * Responsible for loading map featured from data files
 * //TODO: optimise!!
 */
import $ from 'jquery'
import L from 'leaflet'
import 'leaflet-svgicon'
import 'leaflet-ajax'
// eslint-disable-next-line no-unused-vars
import { UserSettings } from './UserSettings.js'
import MapFeature from './MapFeature.js'

/** //TODO: sort refesh
* Loop through all map features and decide if they should be displayed and if the icon is right
*/
export function refreshFeatures () {}

/**
 *  Wrapper function that allows loading of multiple data files
 * @param {Object} map
 * @param {UserSettings} userSettings
 */
export function setupFeatures (map, userSettings) {
  load(map, 'data/all.geojson')
}

/** Middleware function called on the raw data before its added to a layer */
function OSMtoTCSMdataMapper (data) {
  // replace any polygons with a point at centoid - with the same features
  let features = data.features
  features.forEach(function (feature, index) {
    try {
      // add summay tags for sections of the popup
      feature.info = new MapFeature(feature.properties)// 'changing_table,unisex,male,female,drinking_water');
    } catch (error) {
      console.log(error)
    }
  })
  return data
};
/*
function geoJSONLayerFilter (isVisible) {
  return L.dynamicGeoJSON(null, {
    filter: function (feature, layer) {
      return isVisible(feature.properties)
    }
  })
};
*/

/**
 * Load a set of features from a data file and add to the map
 * The geojson needs to be in a specific format
 *
 * @param {Object} map - map control
 * @param {string} dataFile - geojson datafile to load
 * The data files are in a specialised geojson format that's output by the backend postprocessing routines
 * Each feature element MUST have the following element:
 * mapFeature: {
     "layers": [],
     "caption": ,
     "allowPopup": ,
     "icon": ,
     "location": ,
     "description": ,
     "facilities": "",
     "availability": ,
     "contact":,
     "meta":
    }
 */
function load (map, dataFile) {
  /* Open modal & center map on marker click //TODO: move to a property of the layerGroup */
  function markerOnClick (e) {
    let feature = e.target.feature.info
    feature.setupInfoWindow()
    $('#infoWindow').modal('show')
  }

  let layerControl = L.control.layers({}, {},
    {
      collapsed: false,
      position: 'bottomright'
    })

  let layersTree = {} // Tracks the tree of layers - for quick lookups etc while building

  // let masterLayer = L.featureGroup().addTo(map)

  let combinedLayer = new L.GeoJSON.AJAX(dataFile, {
    middleware: function (data) {
      // console.log(`Loaded ${data.features.length} features`)
      return OSMtoTCSMdataMapper(data)
    },
    onEachFeature: function (feature, layer) {
      layer.on('click', markerOnClick)
    },
    pointToLayer: function (feature, latlng) {
      /* let marker = L.marker(latlng)
      marker.addTo(map)
      return marker */
      let icon = feature.info.icon
      let marker = L.marker(latlng, { icon: icon, title: feature.info.caption })

      feature.info.featureInfo.layers.forEach((layerName) => {
        // TODO: nesting of layers
        let layerGroup = layersTree[layerName]
        if (!layerGroup) {
          layerGroup = L.featureGroup([marker])
          layersTree[layerName] = layerGroup
          // masterLayer.addLayer(layerGroup)
          layerControl.addOverlay(layerGroup,
            `<span data-toggle="tooltip" data-placement="top" title="${layerName}" ><i class="${'fa-parking'}"></i> ${layerName}</span>`)
        } else {
          layerGroup.addLayer(marker)
        }
      })
      // console.log(feature)
      return marker
    },
    // filter: filter,
    makeBoundsAware: true
  }).on('data:loaded', function () {
    layerControl.addTo(map)
    layerControl.restoreSelectedLayers()

    // events responding to changes in the displayed layers, save the current selection
    map.on('baselayerchange', function (e) {
      layerControl.saveSelectedLayers()
    })
    map.on('overlayadd', function (e) {
      layerControl.saveSelectedLayers()
    })
    map.on('overlayremove', function (e) {
      layerControl.saveSelectedLayers()
    })
  })
  return combinedLayer
}

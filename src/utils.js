import $ from 'jquery'
import L from 'leaflet'
import * as turf from '@turf/turf'
import FeatureInfo from './FeatureInfo.js'
import copyToClipboard from 'copy-to-clipboard'

/** Middleware function called on the raw data before its added to a layer */
function OSMtoTCSMdataMapper (data, featurePropsList) {
  // replace any polygons with a point at centoid - with the same features
  let features = data.features
  features.forEach(function (feature, index) {
    try {
      if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'LineString') {
        let featureCentroid = turf.centroid(feature)
        feature.geometry = { type: 'Point', coordinates: featureCentroid.geometry.coordinates }
        // swapout the Polygon for a point
        features[index] = feature
      }

      // add summay tags for sections of the popup
      feature.info = new FeatureInfo(feature.properties, featurePropsList)// 'changing_table,unisex,male,female,drinking_water');
    } catch (error) {
      console.log(error)
    }
  })
  // console.log(`returning ${data.features.length} features`)
  return data
};

/** Initialise the featureWindow with data for the chosen marker
  * @param {featureInfo} as FeatureInfo
  *
  */
function setupInfoWindow (featureInfo) {
  console.log(featureInfo.tags)
  $('#infoWindowLabel').text(featureInfo.caption)
  $('.pop-location').html(featureInfo.location)
  $('.pop-facilities').html(featureInfo.facilities)
  $('.pop-availability').html(featureInfo.availability)
  $('.pop-operator').html(featureInfo.operator)
  $('.pop-report').html(featureInfo.report)

  let nodeRef = featureInfo.tags.id

  $('#infoWindowFeedback').on('click', function (event) {
    copyToClipboard(nodeRef)
    $('#feedback').modal()
  })
}
/*
function geoJSONLayerFilter (isVisible) {
  return L.dynamicGeoJSON(null, {
    filter: function (feature, layer) {
      return isVisible(feature.properties)
    }
  })
};
*/
export function CSMLayerFactory (dataFile, featureTags, icon, filter) {
  // console.log(`Loading layer ${dataFile}`)

  let chooseIcon = (icon instanceof Function) ? icon : function () { return icon }

  /* Open modal & center map on marker click */
  function markerOnClick (e) {
    let poi = e.target.feature.info
    // popupFromFeatureInfo(poi);
    setupInfoWindow(poi)
    // $(".modal-content").html(popupFromFeatureInfo(poi));
    // 'This is marker ' + JSON.stringify(e.target.feature));
    $('#infoWindow').modal('show')
    // let centre = (e.target.getLatLng) ? e.target.getLatLng() : e.target.getCenter()
    // e.target._map.setView(centre);
    // e.preventDefault();
  }

  let masterLayer = new L.GeoJSON.AJAX(dataFile, {
    middleware: function (data) {
      // console.log(`Loaded ${data.features.length} features`)
      return OSMtoTCSMdataMapper(data, featureTags)
    },
    onEachFeature: function (feature, layer) {
      layer.on('click', markerOnClick)/* bindPopup(function(feature){
                return popupFromFeatureInfo(feature.feature.info); */
    },

    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: chooseIcon(feature.info) })
    },
    filter: filter,
    makeBoundsAware: true
  })

  return masterLayer
}

export function getTileUrls (map, bounds, tileLayer, minZoom, maxZoom) {
  let urls = []
  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    let min = map.project(bounds.getNorthWest(), zoom).divideBy(256).floor()
    let max = map.project(bounds.getSouthEast(), zoom).divideBy(256).floor()

    for (var i = min.x; i <= max.x; i++) {
      for (var j = min.y; j <= max.y; j++) {
        var coords = new L.Point(i, j)
        coords.z = zoom
        urls.push(tileLayer.getTileUrl(coords))
      }
    }
  }
  return urls
}

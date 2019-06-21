import 'leaflet';
import {CSMLayerFactory} from './utils';

var toiletMarker = L.ExtraMarkers.icon({
    icon: 'fa-toilet',
    markerColor: 'yellow', 
    shape: 'square',
    prefix: 'fa'
});
var toiletMarker2 = L.ExtraMarkers.icon({
  icon: 'fa-toilet',
  markerColor: 'yellow', 
  shape: 'square',
  prefix: 'fa',
  iconColor:'black',
});

let featureTags='changing_table,unisex,male,female,drinking_water';

export const toiletLayerGroup= L.layerGroup([
    CSMLayerFactory("data/toiletsAmenity.geojson",featureTags,toiletMarker),
    CSMLayerFactory("data/toiletsNonAmenity.geojson",featureTags,toiletMarker2)]);

/*

import 'leaflet';
import * as utils from './utils';
import { booleanClockwise } from '@turf/turf';

export const toiletLayer = new L.GeoJSON.AJAX("data/toilets.geojson",{
  onEachFeature: utils.featureToLayer,
  middleware:function (data){ 
    return utils.OSMtoTCSMdataMapper(data,); },
  
});

var toiletMarkerNo = L.ExtraMarkers.icon({
    icon: 'fa-toilet',
    markerColor: 'red', 
    shape: 'square',
    prefix: 'fa'
  });
  var toiletMarkerSome = L.ExtraMarkers.icon({
    icon: 'fa-toilet',
    markerColor: 'orange', 
    shape: 'square',
    prefix: 'fa'
  });
  var toiletMarkerYes = L.ExtraMarkers.icon({
    icon: 'fa-toilet',
    markerColor: 'green', 
    shape: 'square',
    prefix: 'fa'
  });


 
///The property @ID causes problems with ennumeating
function getFeatureDescription (feature){
    var out = [];
    Object.entries(feature.properties).forEach(entry => {
        out.push( "<b>" + entry[0]+"</b>: "+entry[1]);
      });
    return out.join("<br />");
}*/





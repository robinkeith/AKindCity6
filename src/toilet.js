import 'leaflet';
import {CSMLayerFactory} from './utils';
import './dynamicLayers';
import './dynamicLayerGroup';
import {userSettings} from './userSettings';


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

export function toiletLayerGroup(userSettings){
  let featureTags='changing_table,unisex,male,female,drinking_water';

  let filter=function (feature) {
    //return (userSettings.mobility==='wheelchair' && feature.properties.wheelchair === "yes");
    if (userSettings.mobility==='wheelchair') {
      return (feature.properties["wheelchair"] && 
          (feature.properties["wheelchair"]==='yes'))

  } else 
  return true;// && feature.properties.wheelchair === "yes");
  }

  return new L.LayerGroup([
    CSMLayerFactory("data/toiletsAmenity.geojson",featureTags,toiletMarker,filter),
    CSMLayerFactory("data/toiletsAmenity.geojson",featureTags,toiletMarker,filter),
    CSMLayerFactory("data/toiletsNonAmenity.geojson",featureTags,toiletMarker2,filter)
  ]);
}


/*
export const toiletLayerGroup= L.dynamicLayerGroup([
    ],{
      dynamicFilter:function (feature) {
        if (feature.properties.wheelchair === "yes") return true;
      }
 });*/
import 'leaflet';
import {CSMLayerFactory} from './utils.js';
import {userSettings} from './userSettings.js';


var toiletMarker = L.ExtraMarkers.icon({
  icon: 'fa-toilet',
  markerColor: 'yellow', 
  shape: 'square',
  prefix: 'fas'
});
var toiletMarker2 = L.ExtraMarkers.icon({
  icon: 'fa-toilet',
  markerColor: 'yellow', 
  shape: 'square',
  prefix: 'fas',
  iconColor:'black',
});

export function toiletLayerGroup(userSettings){
  let featureTags='changing_table,unisex,male,female,drinking_water';

  let filter=function (feature) {
    if (userSettings.wheelchair) {
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

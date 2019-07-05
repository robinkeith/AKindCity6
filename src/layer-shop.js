import 'leaflet';
import {CSMLayerFactory} from './utils.js';

var shopMarker = L.ExtraMarkers.icon({
    icon: 'fa-shopping-bag',
    markerColor: 'cyan', 
    shape: 'square',
    prefix: 'fas'
});
/*
var glassMarker = L.ExtraMarkers.icon({
    icon: 'fa-wine-glass-alt',
    markerColor: 'purple', 
    shape: 'square',
    prefix: 'fa',

});

var foodMarker = L.ExtraMarkers.icon({
    icon: 'fa-utensils',
    markerColor: 'purple', 
    shape: 'square',
    prefix: 'fa',
});
*/

export default function (userSettings){
    let featureTags='';

    let filter=function (feature) {
        if (userSettings.wheelchair) {
            return (feature.properties["wheelchair"] && 
                (feature.properties["wheelchair"]==='yes'))
      
          } else 
          return true;
      }


    return new L.layerGroup([
        CSMLayerFactory("data/shop.geojson",featureTags,shopMarker,filter),
    ]);
}
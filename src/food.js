import 'leaflet';
import {CSMLayerFactory} from './utils';

var cafeMarker = L.ExtraMarkers.icon({
    icon: 'fa-mug-hot',
    markerColor: 'purple', 
    shape: 'square',
    prefix: 'fa'
});

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


export function foodLayerGroup(userSettings){
    let featureTags='';

    let filter=function (feature) {
        return (userSettings.mobility==='wheelchair' && feature.properties.wheelchair === "yes");
      }


    return new L.layerGroup([
        CSMLayerFactory("data/bar.geojson",featureTags,glassMarker,filter),
        CSMLayerFactory("data/cafe.geojson",featureTags,cafeMarker,filter),                              
        CSMLayerFactory("data/fast_food.geojson",featureTags,foodMarker,filter),
        CSMLayerFactory("data/pubs.geojson",featureTags,glassMarker,filter), 
        CSMLayerFactory("data/resturants.geojson",featureTags,foodMarker,filter), 
    ]);
}
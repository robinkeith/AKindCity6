import 'leaflet';
import {CSMLayerFactory} from './utils.js';

var parkingMarker = L.ExtraMarkers.icon({
    icon: 'fa-parking',
    iconColor:'blue',
    markerColor: 'white', 
    shape: 'square',
    prefix: 'fa'
});
var carparkMarker = L.ExtraMarkers.icon({
    icon: 'fa-parking',
    markerColor: 'blue', 
    shape: 'square',
    prefix: 'fa'
});

var taxiMarker = L.ExtraMarkers.icon({
    icon: 'fa-taxi',
    markerColor: 'black', 
    shape: 'square',
    prefix: 'fa',

});

export function parkingLayerGroup(userSettings){
    let featureTags='';

    let filter=function (feature) {

        if (feature.properties["access"]=="private") return false;
        if (userSettings.wheelchair) {
            if (feature.properties["access"]=="disabled") return true;
            return (feature.properties["capacity:disabled"] && 
                (feature.properties["capacity:disabled"]>0 || feature.properties["capacity:disabled"]==='yes'))

        } else 
        return true;
      }

    return new L.layerGroup([
        CSMLayerFactory("data/parkingMeters.geojson",featureTags,parkingMarker,filter),                              
        CSMLayerFactory("data/parkingSpaces.geojson",featureTags,carparkMarker,filter),
        CSMLayerFactory("data/taxi.geojson",featureTags,taxiMarker,filter)
    ]);
}
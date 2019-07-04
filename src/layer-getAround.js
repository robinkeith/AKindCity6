import 'leaflet';
import {CSMLayerFactory} from './utils.js';

var parkingMarker = L.ExtraMarkers.icon({
    icon: 'fa-parking',
    iconColor:'red',
    markerColor: 'white', 
    shape: 'square',
    prefix: 'fa'
});
var carparkMarker = L.ExtraMarkers.icon({
    icon: 'fa-parking',
    markerColor: 'red', 
    shape: 'square',
    prefix: 'fa'
});


var taxiMarker2 = L.ExtraMarkers.icon({
    icon: 'fa-taxi',
    markerColor: 'red', 
    shape: 'square',
    prefix: 'fa',

});

export default function (userSettings){
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
        /*CSMLayerFactory("data/parkingMeters-hand.geojson",featureTags,parkingMarker,filter),                              
        CSMLayerFactory("data/parkingSpaces-hand.geojson",featureTags,carparkMarker,filter),
        CSMLayerFactory("data/taxi-hand.geojson",featureTags,taxiMarker2,filter)*/
    ]);
}
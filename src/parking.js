import 'leaflet';
import {CSMLayerFactory} from './utils';

var parkingMarker = L.ExtraMarkers.icon({
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

        if (userSettings.mobility==='wheelchair') {
            return (feature.properties["capacity:disabled"] && 
                (feature.properties["capacity:disabled"]>0 || feature.properties["capacity:disabled"]==='yes'))

        } else 
        return true;// && feature.properties.wheelchair === "yes");
      }

    return new L.layerGroup([
        CSMLayerFactory("data/parking.geojson",featureTags,parkingMarker,filter),
        CSMLayerFactory("data/parkingMeters.geojson",featureTags,parkingMarker,filter),                              
        CSMLayerFactory("data/parkingSpaces.geojson",featureTags,parkingMarker,filter),
        CSMLayerFactory("data/taxi.geojson",featureTags,taxiMarker,filter)
    ]);
}
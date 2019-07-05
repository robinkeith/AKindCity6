import 'leaflet';
import {CSMLayerFactory} from './utils.js';
import circleSvg from '../resources/circle.svg'


var circleMarker = L.icon({
    iconUrl: circleSvg,// 'resources/Changing_Place_logo.svg',
    iconSize:     [25   , 25], // size of the icon
});

var mobilityMarker = L.ExtraMarkers.icon({
    icon: 'fa-wheelchair',
    iconColor:'blue',
    markerColor: 'white', 
    shape: 'square',
    prefix: 'fas'
});

export default function (userSettings){
    let featureTags='';

    let filter=function (feature) {

        if (feature.properties["access"]=="private") return false;
        /*if (userSettings.wheelchair) {
            if (feature.properties["access"]=="disabled") return true;
            return (feature.properties["capacity:disabled"] && 
                (feature.properties["capacity:disabled"]>0 || feature.properties["capacity:disabled"]==='yes'))

        } else */
        return true;
      }

    return new L.layerGroup([
        CSMLayerFactory("data/around.geojson",featureTags,circleMarker,filter),
        CSMLayerFactory("data/around-amenities.geojson",featureTags,mobilityMarker,filter),
        /*CSMLayerFactory("data/parkingMeters-hand.geojson",featureTags,parkingMarker,filter),                              
        CSMLayerFactory("data/parkingSpaces-hand.geojson",featureTags,carparkMarker,filter),
        CSMLayerFactory("data/taxi-hand.geojson",featureTags,taxiMarker2,filter)*/
    ]);
}
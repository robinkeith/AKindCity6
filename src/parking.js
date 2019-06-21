import 'leaflet';
import {CSMLayerFactory} from './utils';

var parkingMarker = L.ExtraMarkers.icon({
    icon: 'fa-parking',
    markerColor: 'blue', 
    shape: 'square',
    prefix: 'fa'
});

let featureTags='';
export const parkingLayerGroup= L.layerGroup([
    CSMLayerFactory("data/parking.geojson",featureTags,parkingMarker),
    CSMLayerFactory("data/parkingMeters.geojson",featureTags,parkingMarker),                              
    CSMLayerFactory("data/parkingSpaces.geojson",featureTags,parkingMarker)]);
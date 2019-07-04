import 'leaflet';
import {CSMLayerFactory} from './utils.js';

var safePlacesMarker = L.ExtraMarkers.icon({
    icon: 'fa-hand-holding-heart',
    markerColor: 'yellow', 
    shape: 'square',
    prefix: 'fa'
});

var policeMarker = L.ExtraMarkers.icon({
    //icon: 'fa-hand-holding-heart',
    markerColor: 'blue', 
    //shape: 'square',
    //prefix: 'fa'
});
var medMarker = L.ExtraMarkers.icon({
    //icon: 'fa-hand-holding-heart',
    markerColor: 'green', 
    //shape: 'square',
    //prefix: 'fa'
});

let featureTags='';
export default function (userSettings){
    let featureTags='';

    let filter=function (feature) {return true;  }

    return new L.layerGroup([
        CSMLayerFactory("data/help-safePlaces.geojson",featureTags,safePlacesMarker,filter),
        CSMLayerFactory("data/help-services.geojson",featureTags,policeMarker,filter),
    ]);
}
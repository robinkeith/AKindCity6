import 'leaflet';
import {CSMLayerFactory} from './utils.js';

var safePlacesMarker = L.ExtraMarkers.icon({
    icon: 'fa-hand-holding-heart',
    markerColor: 'red', 
    shape: 'square',
    prefix: 'fa'
});

let featureTags='';
export function helpLayerGroup(userSettings){
    let featureTags='';

    let filter=function (feature) {return true;  }

    return new L.layerGroup([
        CSMLayerFactory("data/safePlaces.geojson",featureTags,safePlacesMarker,filter),
    ]);
}
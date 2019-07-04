import 'leaflet';
import {CSMLayerFactory} from './utils.js';
import {userSettings} from './userSettings.js';
import changingPlacesLogo from './../resources/Changing_Place_logo.svg'


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

var changingPlacesMarker = L.icon({
    iconUrl: changingPlacesLogo,// 'resources/Changing_Place_logo.svg',
    //shadowUrl: 'leaf-shadow.png',

    iconSize:     [45, 45], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    //iconAnchor:   [20 , 20], // point of the icon which will correspond to marker's location
   // shadowAnchor: [4, 62],  // the same for the shadow
    //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
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

  /**
   * choose an appropriate icon based on the feature's properties
   * @param {*} feature feature object
   */
  function chooseIcon(feature){
    //console.log(feature.tags.name);
    return (feature.tags.name && feature.tags.name.includes('Changing Places'))?changingPlacesMarker:
     ((feature.tags.amenity==='toilets')?toiletMarker:toiletMarker2);
  }
   
  return new L.LayerGroup([
    CSMLayerFactory("data/toiletsAmenity.geojson",featureTags,chooseIcon,filter),
    CSMLayerFactory("data/toiletsNonAmenity.geojson",featureTags,chooseIcon,filter)
  ]);
}

import './node_modules/leaflet/dist/leaflet.css';
import 'leaflet';
//import L from 'leaflet'


import './index.css';
import 'leaflet-ajax';
//import vectorTileLayer from 'leaflet-vector-tile-layer';
//import 'leaflet.vectorgrid';
import 'leaflet-extra-markers';
import './node_modules/leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'leaflet-easybutton';
import './node_modules/leaflet-easybutton/src/easy-button.css';
import 'leaflet.locatecontrol';
import './node_modules/leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet-fullscreen';
import './node_modules/leaflet-fullscreen/dist/Leaflet.fullscreen.css';
//import 'Leaflet.Deflate';
import 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import './node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.css';

//import 'leaflet.pancontrol';
//import './data/safeplaces.geojson';
//import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('./node_modules/leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('./node_modules/leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('./node_modules/leaflet/dist/images/marker-shadow.png'),
});

const mapbox_api_key='pk.eyJ1Ijoicm9iaW5rZWl0aCIsImEiOiJjanZrdnV1cDUwdGRuNGJtbHViNmQ4ZHh6In0.eZvncacC218djhVbySv5CQ';

let map = L.map('map', 
    {
        boxZoom:false,
        center:[52.628533,1.291904],
        zoom:15,
        minZoom	:13,
        maxZoom:20,
        maxBounds:[[52.584648,1.183911],[52.68566,1.518445]],
        fullscreenControl: true,

    });

const defaultBaseLayer=
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoicm9iaW5rZWl0aCIsImEiOiJjanY5MHJrd2swand1NDRucjk2MnR4ejJ1In0.8f5HJ5ZWoRPbUoWcVjaQpg', {
    maxZoom: 20,
    minZoom: 13,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);

 var foodMarker = L.ExtraMarkers.icon({
    icon: 'fa-utensils',
    markerColor: 'red', 
    shape: 'square',
    prefix: 'fa'
  });

  var parkingMarker = L.ExtraMarkers.icon({
    icon: 'fa-parking',
    markerColor: 'blue', 
    shape: 'square',
    prefix: 'fa'
  });

  var toiletMarkerNo = L.ExtraMarkers.icon({
    icon: 'fa-toilet',
    markerColor: 'red', 
    shape: 'square',
    prefix: 'fa'
  });
  var toiletMarkerSome = L.ExtraMarkers.icon({
    icon: 'fa-toilet',
    markerColor: 'orange', 
    shape: 'square',
    prefix: 'fa'
  });
  var toiletMarkerYes = L.ExtraMarkers.icon({
    icon: 'fa-toilet',
    markerColor: 'green', 
    shape: 'square',
    prefix: 'fa'
  });


  var helpMarker = L.ExtraMarkers.icon({
    icon: 'fa-exclamation',
    markerColor: 'red', 
    shape: 'square',
    prefix: 'fa'
  });

  var chairMarker = L.ExtraMarkers.icon({
    icon: 'fa-accessible-icon',
    markerColor: 'red', 
    shape: 'square',
    prefix: 'fab'
  });


function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
   // if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(getFeatureDescription(feature));
    /*} else {
        console.log("no props");
    }*/
}

//The property @ID causes problems with ennumeating
function getFeatureDescription (feature){
    var out = [];
    Object.entries(feature.properties).forEach(entry => {
        out.push( "<b>" + entry[0]+"</b>: "+entry[1]);
      });
    return out.join("<br />");
}

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};


const safePlacesLayer = new L.GeoJSON.AJAX("data/safePlaces.geojson",{ //options object for GeoJSON
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon:helpMarker});
    },
    onEachFeature: onEachFeature,
  });

const parkingMetersLayer = new L.GeoJSON.AJAX("data/parkingMeters.geojson",{
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon:parkingMarker});
    },
    });
const parkingSpacesLayer = new L.GeoJSON.AJAX("data/parkingSpaces.geojson",{
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon:parkingMarker});
    },
});
const parkingLayer = new L.GeoJSON.AJAX("data/parking.geojson",{
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon:parkingMarker});
    },
});
//const parkingLayerGroup=L.deflate({minSize: 10}).addLayer([parkingMetersLayer, parkingSpacesLayer,parkingLayer]);
const parkingLayerGroup= L.layerGroup([parkingMetersLayer, parkingSpacesLayer,parkingLayer])

const wheelchairLayer = new L.GeoJSON.AJAX("data/wheelchair.geojson",{
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon:chairMarker});
    },
});


//var deflate_features = L.deflate({minSize: 20});

const toiletLayer = new L.GeoJSON.AJAX("data/toilets.geojson",{
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        let toiletMarker=toiletMarkerSome;
        let properties=feature.properties;
        if (properties.access==="yes" || properties.wheelchair==="yes") {
            toiletMarker=toiletMarkerYes;
        }
        return L.marker(latlng, {icon: toiletMarker,});
    },
}).addTo(map);
//deflate_features.addTo(map);

//L.easyBar([
    L.easyButton( 'fa-user-cog', function(){
        alert("This is where you'll be able to choose settings to suit your needs.","It's All About Me");
    },"Personalise the map for me",{position: 'bottomright'}).addTo(map);

    L.easyButton( 'fa-info', function(){
        alert("The map helps everybody enjoy our Kind City. The map is brought to you by the Clare School, in association with ???? The map is built with open source libraries including ...","Norwich Access Map");
    },'About the map',{position: 'bottomright'}).addTo(map);
//],
/*    {
        position:"topright",
    });
*/
var lc = L.control.locate({
    position: 'topleft',
    strings: {
        title: "Show where I am"
    },
    flyTo:true,
    returnToPrevBounds:true,
}).addTo(map);

L.Routing.control({
    /*waypoints: [
        L.latLng(57.74, 11.94),
        L.latLng(57.6792, 11.949)
    ],*/
    routeWhileDragging: false,
    geocoder: L.Control.Geocoder.nominatim(),
    //router:// L.Routing.mapbox(mapbox_api_key,{ profile: 'mapbox/walking' }),
    collapsed:false,
    position:'bottomleft',
}).addTo(map);

//const tileLayer = vectorTileLayer(url, options);
//var url = 'https://d2munx5tg0hw47.cloudfront.net/tiles/{z}/{x}/{y}.mapbox';
//var mapillaryLayer = L.vectorGrid.protobuf(url).addTo(map);

const emptyLayer =  L.tileLayer('');

L.control.layers({
    
    "Roads": defaultBaseLayer,
    }, 
    {
        "Parking": parkingLayerGroup,
        "Toilets":toiletLayer,
        "Dementia Aware":emptyLayer,
        "Resturants":emptyLayer,
        "Reviews":emptyLayer,
        "Accessible":wheelchairLayer,
        "Help!": safePlacesLayer,
    },
    {
        collapsed:false,
        position:'topright',
    }).addTo(map);

// L.control.pan().addTo(map);
//L.geoJSON(geojsonFeature).addTo(map);
/*
function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

//map.locate({setView: true, maxZoom: 16});*/
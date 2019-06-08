import './node_modules/leaflet/dist/leaflet.css';
import 'leaflet';
import './index.css';
import 'leaflet-ajax';
//import vectorTileLayer from 'leaflet-vector-tile-layer';
import 'leaflet.vectorgrid';
import 'leaflet-extra-markers';
import './node_modules/leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css'
//import 'leaflet.pancontrol';
//import './data/safeplaces.geojson';
//import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


let map = L.map('map', 
    {
        boxZoom:false,
        center:[52.628533,1.291904],
        zoom:15,
        minZoom	:13,
        maxZoom:20,
        maxBounds:[[52.584648,1.183911],[52.68566,1.518445]],
        //,scrollWheelZoom:,

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
    prefix: 'fa'
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
const parkingLayerGroup= L.layerGroup([parkingMetersLayer, parkingSpacesLayer,parkingLayer])

const wheelchairLayer = new L.GeoJSON.AJAX("data/wheelchair.geojson",{
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon:chairMarker});
    },
});

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
    {collapsed:false,}).addTo(map);

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
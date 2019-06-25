import $ from "jquery";
import popper from "popper.js";
import bootstrap from "bootstrap";

import './node_modules/leaflet/dist/leaflet.css';
import 'leaflet';
import './index.css';
import 'leaflet-ajax';
import 'leaflet-extra-markers';
import './node_modules/leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'leaflet-easybutton';
import './node_modules/leaflet-easybutton/src/easy-button.css';
import 'leaflet.locatecontrol';
import './node_modules/leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet-fullscreen';
import './node_modules/leaflet-fullscreen/dist/Leaflet.fullscreen.css';
import 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import './node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './src/utils';
import 'leaflet.restoreview';
//import './src/dynamicLayers'; //dynamicLayers is the control
//import './src/dynamicLayerGroup'; //dynamicLayerGroup is the data model.
import {UserSettings,initUserSettingsForm,setupSettingsFormSubmit} from './src/userSettings';
import {createLayers} from './src/layerHandler';
import {defaults} from './src/defaults';

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('./node_modules/leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('./node_modules/leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('./node_modules/leaflet/dist/images/marker-shadow.png'),
    });

    
    let userSettings= new UserSettings();



    let map = L.map('map', {
        boxZoom:false,
        //maxBounds:[[52.584648,1.183911],[52.68566,1.518445]],
        //lat = 52.628101, long= 1.299350
        maxBounds:defaults.maxBounds,
        fullscreenControl: true,
        maxZoom:defaults.maxZoom,
        minZoom:defaults.minZoom,
    });
    let layerControl = createLayers(map,userSettings);
    if (!map.restoreView()) {
        map.setView(defaults.mapCentre, defaults.zoom);
    }

    

    L.easyButton( 'fab fa-accessible-icon', function(){
        //layerControl.saveSelectedLayers();

        userSettings.wheelchair= !userSettings.wheelchair;
        //userSettings.parkingLayer.refresh();
        layerControl.refreshLayers(userSettings);
       /* .refilter(function(feature){
            return false;
        })*/;
    },"Only show accessible features",{position: 'bottomright'}).addTo(map);
    

L.easyButton( 'fa-user-cog', function(){
    //alert("This is where you'll be able to choose settings to suit your needs.","It's All About Me");
    userSettings.initUserSettingsForm();
    
    $('#personalSettings').modal();
},"Personalise the map for me",{position: 'bottomright'}).addTo(map);
userSettings.setupSettingsFormSubmit();


L.easyButton( 'fa-info', function(){
    alert("The map helps everybody enjoy our Kind City. The map is brought to you by the Clare School, in association with ???? The map is built with open source libraries including ...","Norwich Access Map");
},'About the map',{position: 'bottomright'}).addTo(map);

L.control.locate({
    position: 'topleft',
    strings: {
        title: "Show where I am"
    },
    flyTo:true,
    returnToPrevBounds:true,
}).addTo(map);
/*
    L.Routing.control({
        /*plan:new L.Routing.Plan([],{
                addWaypoints:false,
                draggableWaypoints:false,
            })	,* /
        routeWhileDragging: false,
        geocoder: L.Control.Geocoder.nominatim(),
        //router:// L.Routing.mapbox(mapbox_api_key,{ profile: 'mapbox/walking' }),
        collapsed:true,
        position:'bottomleft',
    }).addTo(map);*/

    //const tileLayer = vectorTileLayer(url, options);
    //var url = 'https://d2munx5tg0hw47.cloudfront.net/tiles/{z}/{x}/{y}.mapbox';
    //var mapillaryLayer = L.vectorGrid.protobuf(url).addTo(map);

  
  //  {"lat":52.628578970472866,"lng":1.2989358866616387,"zoom":15}

 

 /*   var chairMarker = L.ExtraMarkers.icon({
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
        }* /
    }

    //The property @ID causes problems with ennumeating
    function getFeatureDescription (feature){
        var out = [];
        Object.entries(feature.properties).forEach(entry => {
            out.push( "<b>" + entry[0]+"</b>: "+entry[1]);
        });
        return out.join("<br />");
    }

  

    const wheelchairLayer = new L.GeoJSON.AJAX("data/wheelchair.geojson",{
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon:chairMarker});
        },
    });
*/
$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover',
        placement: 'right'
    });
})

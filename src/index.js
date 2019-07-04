import $ from 'jquery'
import popper from 'popper.js'
import bootstrap from 'bootstrap'
import 'bootstrap/js/dist/tooltip';


window.$ = window.jQuery = $
window.bootstrap = bootstrap
window.popper = popper
import './app.scss'
import '@fortawesome/fontawesome-free' //free-solid-svg-icons
import '@fortawesome/fontawesome-free/css/all.css'
import '/node_modules/leaflet/dist/leaflet.css';
import 'leaflet';
import './modern-ui.css';
import './index.css';
import 'leaflet-ajax';
import 'leaflet-extra-markers';
import '/node_modules/leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';

import './utils.js';
import '@bagage/leaflet.restoreview';
import {UserSettings,initUserSettingsForm,setupSettingsFormSubmit} from './userSettings.js';
import {createLayers} from './layerHandler.js';
import {defaultSettings} from './defaultSettings.js';
import {setup} from './mapControls.js';

/*-----Hacky workaround to get leaflet icons to wotk with the build ----------------------------*/
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('/node_modules/leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('/node_modules/leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('/node_modules/leaflet/dist/images/marker-shadow.png'),
});


let userSettings= new UserSettings();

/* ----------------------------------------Create the map----------------------------------------*/

    let map = L.map('map', {
        boxZoom:false,
        //maxBounds:[[52.584648,1.183911],[52.68566,1.518445]],
        //lat = 52.628101, long= 1.299350
        maxBounds:defaultSettings.maxBounds,
        //fullscreenControl: true,
        maxZoom:defaultSettings.maxZoom,
        minZoom:defaultSettings.minZoom,
        zoomControl: false,
    });
    //add the layers and restore the view
    let layerControl = createLayers(map,userSettings);
    if (!map.restoreView()) {
        map.setView(defaultSettings.mapCentre, defaultSettings.zoom);
    }

    
    

/*-------------------Map Logo--------------------------------------------------------------------*/
var mapControlsContainer = document.getElementsByClassName("leaflet-bottom leaflet-left")[0];
var logoContainer = document.getElementById("logoContainer");
mapControlsContainer.appendChild(logoContainer);

setup(map,layerControl,userSettings);

/*-----------------------------------------------------------------------------------------------*/

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
/*--------------------Search Controls -------------------------------------------*/

/*-------------------jQuery document ready, fix ups -------------------------------------*/
$(function () {
    
  $('[data-toggle="tooltip"]').tooltip({
      trigger : 'hover',
      //placement: 'right'
      container: 'body'
  });

  
  //tweak the buttons so the colour is applied to the parent
  $( ".leaflet-control-layers-overlays label i" )
  .each(function(index,el){ 
      $(this).parents("label").css("background-color",$(this).css("background-color"))})

    
    /* Open modal & center map on marker click 	*/
    function markerOnClick(e) {
        var id = this.options.id;
        $(".modal-content").html('This is marker ' + id);
        $('#infoWindow').modal('show');
        map.setView(e.target.getLatLng());
        e.preventDefault();
    }
    
      /*Close modal on map click */
    map.on('click', function(e) {
        $('.modal').modal('hide');
    });
})

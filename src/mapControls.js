/** Setup map controls. Don't add to the map, just export the control */
import 'leaflet-easybutton';
import '/node_modules/leaflet-easybutton/src/easy-button.css';
import 'leaflet.locatecontrol';
import '/node_modules/leaflet.locatecontrol/dist/L.Control.Locate.min.css';
import 'leaflet-fullscreen';
import '/node_modules/leaflet-fullscreen/dist/Leaflet.fullscreen.css';
import 'leaflet-control-geocoder';
import 'leaflet-toolbar';
import '/node_modules/leaflet-toolbar/dist/leaflet.toolbar-src.css';
import 'leaflet-search';
import 'leaflet-sidebar-v2';
import 'leaflet-easyprint-forked';
import {defaultSettings} from './defaultSettings.js';

export function setup(map, layerControl,userSettings){

 const osmSearchControl = new L.Control.Search({
    url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}&dedupe=1&bounded=1&limit=5&viewbox=' + 
        escape( defaultSettings.maxBounds.toBBoxString()),
    jsonpParam: 'json_callback',
    propertyName: 'display_name',
    propertyLoc: ['lat','lon'],
    circleLocation: false,
    autoType: false,
    autoCollapse: false,
    minLength: 3,
    zoom:16,
    textPlaceholder: 'Search Addresses',
    collapsed: false
  }).
    on('search_locationfound', function(e) {
        osmSearchControl.collapse();
        if(marker){
            map.removeLayer(marker);
        }
        var name = e.display_name;
        marker = new L.marker([e.latlng.lat, e.latlng.lng], {icon: ovrdcMarker}).addTo(map);
    });
//osmsearch.addTo(map);
var circle;
var marker;

  //Feature search
 const featureSearchControl = new L.Control.Search({
    layer: new L.LayerGroup( layerControl._layers.map(x => x.layer)),
    initial: false,
    propertyName: 'name',
    circleLocation:false,
    collapsed:false,
    textPlaceholder:'Search Points of Interest',
    zoom:'15'})
    .on('search_locationfound', function() { map.setZoom(18); })
    .on ('search_locationfound', function(e) {
        e.layer.fire('click');
        search.collapse();
    });
//map.addControl(search);


const globalsearchToggleButton = new L.easyButton({
  states: [{
    stateName: 'show',
    icon: 'fas fa-exchange-alt fa-lg',
    title: 'Search Addresses',
    onClick: function(btn, map) {
      osmsearch.addTo(map);
    btn.state('hide');
      }
    },{
    stateName: 'hide',
  icon: 'fas fa-exchange-alt fa-border fa-lg',
    title: 'Search Features',
    onClick: function(btn, map) {
      map.removeControl(osmsearch);
      btn.state('show');
    }
  }]
});



/*------- GPS Locater ------------------------------------------------------------------*/
const gpsLocateButton = L.control.locate({
    follow: true, 
    locateOptions: {enableHighAccuracy: true},
    strings: {
      title: "Show where I am"
    },
    flyTo:true,
    returnToPrevBounds:true,
});

/*--------------Full screen control */
const fullscreenButton = L.control.fullscreen();

/*-----------------about us --------------------------*/
const infoButton = L.easyButton( 'fa-info', function(){
  $('#about').modal();
},'About the Map',{position: 'topleft'});

/*-----Quick wheelchair view buttom - demo only -------------------------------------------*/
const quickAccessButton =L.easyButton( 'fab fa-accessible-icon', function(){
    userSettings.wheelchair= !userSettings.wheelchair;
    layerControl.refreshLayers(userSettings);
  },"Only show accessible features",{position: 'topleft'});
  
/* --------------------Easy print control ------------------------ */
const printButton = L.easyPrint();

/*-----Personalisation---Form---------------------*/
const personaliseButton = L.easyButton( 'fa-user-cog', function(){
  userSettings.initUserSettingsForm();
  $('#personalSettings').modal();
},"Personalise the map for me",{position: 'topleft'});

userSettings.setupSettingsFormSubmit();


/*--------------------Sidebar ------------------*/
const sidebarControl = L.control.sidebar( {container:'sidebar', autoPan: false, closeButton: false });


const sidebarToggleControl = L.easyButton({
  states: [{
      stateName: 'open-sidebar',   // name the state
      icon:      'fa-bars fa-lg',          // and define it's properties
      title:     'Show Sidebar', // like it's title
      onClick: function(btn, map) {  // and it's callback
          sidebar.show();
          btn.state('close-sidebar'); // change state on click!
      }
      }, {
          stateName: 'close-sidebar',
          icon:      'fa-times fa-2x',
          title:     'Hide Sidebar',
          onClick: function(btn, map) {
              sidebar.hide();
              btn.state('open-sidebar');
          }
      }],
    id: 'menu',
    });
   /* sidebarToggleControl.on('hide', function () {
        sidebarToggle.state('open-sidebar');
    })
    sidebarToggleControl.on('show', function () {
      sidebarToggle.state('close-sidebar');
    });
*/

  //var stogglebar = L.easyBar([sidebarToggle], {id: 'toggle'})//fullscreenButton,globalsearchToggleButton,gpsLocateButton,
  //let toolBar = L.easyBar([personaliseButton,quickAccessButton,infoButton ]); //, {id: 'toggle'})
    
  map.addControl( sidebarControl)
      .addControl(osmSearchControl)
      
      .addControl(featureSearchControl)
      //.addControl(toolBar);
     
       .addControl(personaliseButton)      
      .addControl(gpsLocateButton)
      .addControl(fullscreenButton)
      .addControl(infoButton)
      .addControl(quickAccessButton)
      //.addControl(printButton)
     // .addControl(globalsearchToggleButton)

      //quickAccessButton
  }


/*
//mobile toolbar menu
//--tools toggle on small screens
var toolshidden = false;
var mobilescreen = false;
var tools = L.easyButton({
      states: [{
              stateName: 'show-tools',   // name the state
              icon:      'fa-cogs fa-lg',          // and define it's properties
              title:     'Show Map Tools', // like it's title
              onClick: function(btn, map) {  // and it's callback
                  leafletprint.addTo(map);
                  gpsLocate.addTo(map);
                  //homeExtent.addTo(map);
                  fullscreen.addTo(map);
                  
                  globalsearchToggle.addTo(map);
                  
                  btn.state('hide-tools'); // change state on click!
                  toolshidden = false;
                  //console.log(toolshidden + ' state changed to hideTools');
              }
          }, {
              stateName: 'hide-tools',
              icon:      'fa-cogs fa-border fa-lg',
              title:     'Hide Map Tools',
              onClick: function(btn, map) {
                  map.removeControl(leafletprint);
                  map.removeControl(gpsLocate);
                  //map.removeControl(homeExtent);
                  map.removeControl(fullscreen);
                  
                  map.removeControl(globalsearchToggle);
                  
                  btn.state('show-tools');
                  toolshidden = true;
                  //console.log(toolshidden+ ' state changed to showTools');
              }
      }],
    id: 'tools',
 });
console.log('tools loaded');*/

/*
var w = window.innerWidth;
console.log('screen width: ' + w);
if (w < 481) {
  tools.addTo(map);
  toolshidden = true;
  mobilescreen = true;
  //console.log('mobile tool toggle');
  //console.log(toolshidden + "mobilescreen: " + mobilescreen);
}else{*/
  /*leafletprint.addTo(map);
  gpsLocate.addTo(map);
  //homeExtent.addTo(map);
  fullscreen.addTo(map);
  
  globalsearchToggle.addTo(map);
  
  toolshidden = false;*/
  //console.log(toolshidden + " " + mobilescreen);
//
/*}
window.onresize = function() {
  if ( toolshidden === true && window.innerWidth > 480 && mobilescreen === true) {
    leafletprint.addTo(map);
    gpsLocate.addTo(map);
    //homeExtent.addTo(map);
    fullscreen.addTo(map);
    
    globalsearchToggle.addTo(map);
    
    map.removeControl(tools);
    toolshidden = false;
    mobilescreen = false;
    //console.log(toolshidden + " " + mobilescreen);
  }
  else if ( toolshidden === false && mobilescreen === true && window.innerWidth > 481) {
    tools.state('show-tools');
    mobilescreen = false;
    map.removeControl(tools);
    //console.log(toolshidden + "" + mobilescreen);
  }
  else if ( toolshidden === false && window.innerWidth < 481 && mobilescreen === false) {
    map.removeControl(leafletprint);
    map.removeControl(gpsLocate);
    //map.removeControl(homeExtent);
    map.removeControl(fullscreen);
    
    map.removeControl(globalsearchToggle);
    
    tools.addTo(map);
    toolshidden = true;
    mobilescreen = true;
    //console.log(toolshidden + " " + mobilescreen);
  }
  else {}
};*/
//--end tools toggle
//var loading = L.Control.loading({position:'topright'}).addTo(map);
//end OVRDC Modern UI Toolbar

/*function info(e) {
    var layer = e.target;
    var lineinfo = "";
    for (var k in layer.feature.properties) {
      var v = String(layer.feature.properties[k]);
      lineinfo += '<b>' + k + '</b><br>' + v + '<br>' + '<hr style="margin:5px 0px;">';
    };
    mapinfo.innerHTML = lineinfo;
    //ports.setStyle(style);
    //layer.setStyle(selected);
    sidebar.show();
    sidebarToggle.state('close-sidebar');
  };
  
  function updateinfo(feaure, layer) {
    layer.on({
      click: info,
      mouseover: info
    })
  };
*/

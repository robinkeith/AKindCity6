//import {contributeLayer} from './contribute';
import 'leaflet';
import store from 'store2';
import 'leaflet-edgebuffer';
import 'leaflet-providers';
import 'leaflet-boundsawarelayergroup';

import getHereLayerGroup from './layer-getHere';
import getAroundLayerGroup from './layer-getAround';
import toiletLayerGroup from './layer-toilet';
import foodLayerGroup from './layer-food';
import helpLayerGroup from './layer-help';

import {userSettings} from './userSettings.js';
import {defaultSettings} from './defaultSettings.js';

const LAYERS_KEY="activeLayers"

L.LayerGroup.include({
    refreshLayers: function (userSettings) {
       // Iterate all layers in the group
       Object.entries(this._layers).forEach(function (datalayer) {
            datalayer[1].refresh();
        });
    }
});


L.Control.Layers.include({
    refreshLayers: function (userSettings) {

       // Iterate all layers in control
        this._layers.forEach(function (datalayer) {

            // Check if it's an overlay 
            if (datalayer.overlay) {

                let subLayer=datalayer.layer;
                //if it's a layergroup, iterate each child layer
                if (subLayer._layers) {
                    subLayer.refreshLayers(userSettings);
                } else {
                    if (subLayer.refresh) { subLayer.refresh();}
                }
                //obj.layer.refresh();
            }
        });
    },
    saveSelectedLayers:function(){

        let activeLayers=[];
        //let map=this._map;
        this._layers.forEach( (datalayer) => {
            if (this._map.hasLayer(datalayer.layer)){
                activeLayers.push(datalayer.name);
            }
        },this);
        //save to local storage
        store.set(LAYERS_KEY,JSON.stringify( activeLayers));

    },
    restoreSelectedLayers:function(){

        if (this._map) {
            let activeLayers= JSON.parse( store.get(LAYERS_KEY)) || defaultSettings.activeLayers;
            this._layers.forEach( (layer) =>{
                if (activeLayers.includes(layer.name)) {
                    this._map.addLayer(layer.layer);
                }
            },this);
        }

    }
});

const defaultBaseLayer=
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoicm9iaW5rZWl0aCIsImEiOiJjanY5MHJrd2swand1NDRucjk2MnR4ejJ1In0.8f5HJ5ZWoRPbUoWcVjaQpg', {
maxZoom: defaultSettings.maxZoom,
minZoom: defaultSettings.minZoom,
bounds:defaultSettings.maxBounds,
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
id: 'mapbox.streets'
});

const mapbox_api_key='pk.eyJ1Ijoicm9iaW5rZWl0aCIsImEiOiJjanY5MHJrd2swand1NDRucjk2MnR4ejJ1In0.8f5HJ5ZWoRPbUoWcVjaQpg';

const PedestrianBaseLayer =
L.tileLayer('https://api.mapbox.com/styles/v1/robinkeith/cjwxqu5ke4f451cp6uyqcuhcj/tiles/256/{z}/{x}/{y}?access_token='+mapbox_api_key, {
    maxZoom: defaultSettings.maxZoom,
    minZoom: defaultSettings.minZoom,
    bounds:defaultSettings.maxBounds,
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
id: 'mapbox.streets'
})

export function createLayers(map,userSettings) {
    //const emptyLayer =  L.tileLayer('');
    let overlays=[
        {tooltip:'Parking, taxis, bus and rail',icon:'fas fa-parking'      ,title:'Get Here',     layer:getHereLayerGroup(userSettings)},
        {tooltip:'Ramps, stairs, lifts',        icon:'fas fa-info-circle'  ,title:'Get Around',   layer: getAroundLayerGroup(userSettings)},
        {tooltip:'Toilets and Changing Places', icon:'fas fa-toilet'       ,title:'Toilets',      layer:toiletLayerGroup(userSettings)},
        {tooltip:'Cafes, restuants, and pubs',  icon:'fas fa-utensils'     ,title:'Eat and Drink', layer:foodLayerGroup(userSettings)},
        {tooltip:'Shops',                       icon:'fas fa-shopping-cart',title:'Shop'},
        {tooltip:'Learn',                       icon:'fas fa-hands-helping',title:'Learn'},
        {tooltip:'Cinemas, bowling, entertainment',           icon:'fas fa-smile-beam'   ,title:'Enjoy'}        
    ];

    

    defaultBaseLayer.addTo(map);

    let layerControl= L.control.layers({
            'Roads': defaultBaseLayer,
        }, {},
        {
            collapsed:false,
            position:'bottomright',
    });
    
    overlays.forEach(function(overlay){

        if (overlay.layer) {

            layerControl.addOverlay(overlay.layer,
                `<span data-toggle="tooltip" data-placement="top" title="${overlay.tooltip}" ><i class="${overlay.icon}"></i> ${overlay.title}</span>`
            )
        }
    });

    layerControl.addTo(map);
    layerControl.restoreSelectedLayers();


    
    //Add a mask layer to fade out areas outside the city
    /*let masterLayer= new L.GeoJSON.AJAX('../data/cityBoundry.geojson',{
        fillOpacity: 0.5,
    }).addTo(map);*/

    
    //events responding to changes in the displayed layers, save the current selection
    map.on('baselayerchange', function (e) {
        layerControl.saveSelectedLayers();
    });
    map.on('overlayadd', function (e) {
        layerControl.saveSelectedLayers();
    });
    map.on('overlayremove', function (e) {
        layerControl.saveSelectedLayers();
    });


    return layerControl;
}


/*"Roads": defaultBaseLayer,
"Pedestrian": PedestrianBaseLayer,
"High Contrast":L.tileLayer.provider('Stamen.Toner'),
"Alt Map 1":L.tileLayer.provider('Esri.WorldStreetMap'),
"Alt Map 2":L.tileLayer.provider('Esri.WorldTopoMap'),
"Alt Map 3":L.tileLayer.provider('Esri.WorldImagery'),
"Alt Map 4":L.tileLayer.provider('CartoDB.Voyager'),
"Alt Map 5":L.tileLayer.provider('OpenStreetMap.Mapnik'),
"Alt Map 6":L.tileLayer.provider('Thunderforest.Transport'),
"Alt Map 7":L.tileLayer.provider('Thunderforest.TransportDark'),

*/
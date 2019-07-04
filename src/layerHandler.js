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
    const emptyLayer =  L.tileLayer('');

    defaultBaseLayer.addTo(map);

    let layerControl= L.control.layers({
        
        /*"Roads": defaultBaseLayer,
        "Pedestrian": PedestrianBaseLayer,
        "High Contrast":L.tileLayer.provider('Stamen.Toner'),
        "Alt Map 1":L.tileLayer.provider('Esri.WorldStreetMap'),
        "Alt Map 2":L.tileLayer.provider('Esri.WorldTopoMap'),
        "Alt Map 3":L.tileLayer.provider('Esri.WorldImagery'),
        "Alt Map 4":L.tileLayer.provider('CartoDB.Voyager'),
        "Alt Map 5":L.tileLayer.provider('OpenStreetMap.Mapnik'),
        "Alt Map 6":L.tileLayer.provider('Thunderforest.Transport'),
        "Alt Map 7":L.tileLayer.provider('Thunderforest.TransportDark'),*/
        }, 
        {
            '<span data-toggle="tooltip" data-placement="top" title="Parking, taxis, bus and rail" ><i class="fas fa-parking"></i> Get Here</span>': getHereLayerGroup(userSettings),
            '<span data-toggle="tooltip" data-placement="top" title="Ramps, stairs, lifts"><i class="fas fa-info-circle"></i> Get Around': getAroundLayerGroup(userSettings),
            '<span data-toggle="tooltip" data-placement="top" title="Toilets and Changing Places"><i class="fas fa-toilet"></i> Toilets':toiletLayerGroup(userSettings),
            '<span data-toggle="tooltip" data-placement="top" title="Cafes, restuants, and pubs"><i class="fas fa-utensils"></i> Eat and Drink':foodLayerGroup(userSettings),
            '<span data-toggle="tooltip" data-placement="top" title="Shops"><i class="fas fa-shopping-cart"></i> Shop':emptyLayer,
            '<span data-toggle="tooltip" data-placement="top" title="Learn"><i class="fas fa-hands-helping"></i> Learn':emptyLayer,
            '<span data-toggle="tooltip" data-placement="top" title="Cinemas, bowling "><i class="fas fa-smile-beam"></i> Enjoy':emptyLayer,
            
            '<span data-toggle="tooltip" data-placement="top" title="Services to keep you safe."><i class="fas fa-exclamation"></i> <strong>Help</strong>': helpLayerGroup(userSettings),
            //"<i>Contribute</i>":contributeLayer,
        },
        {
            collapsed:false,
            position:'bottomright',
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

/* Returns a object capable of taking a geoJSON layer and filtering it against settings
function geoJSONLayerFilter(isVisible){

    return L.geoJson(null, { 
        filter: function(feature, layer) {
            return isVisible(feature.properties);
        },
    });
        
};

let settingsFilter=geoJSONLayerFilter(settings.isVisible);

settingsFilter.a
*/
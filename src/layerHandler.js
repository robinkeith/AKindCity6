//import {contributeLayer} from './contribute';
import 'leaflet';
import {toiletLayerGroup} from './toilet';
import {parkingLayerGroup} from './parking';
import {foodLayerGroup} from './food';
import {helpLayerGroup} from './help';
import {userSettings} from './userSettings';
import store from 'store2'

/*L.Layer.include({
    refresh: function (userSettings) {
       this.refresh;
    }
});*/

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

        let defaultLayer= "[\"Roads\"]";
        if (this._map) {
            let activeLayers= JSON.parse( store.get(LAYERS_KEY,defaultLayer));
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
//maxZoom: 20,
//minZoom: 13,
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
id: 'mapbox.streets'
});

//https://api.mapbox.com/styles/v1/robinkeith/cjvuhr3eg2i351coyuneypdsu/wmts?access_token=pk.eyJ1Ijoicm9iaW5rZWl0aCIsImEiOiJjanY5MHJrd2swand1NDRucjk2MnR4ejJ1In0.8f5HJ5ZWoRPbUoWcVjaQpg
//https://api.mapbox.com/styles/v1/robinkeith/cjvuhr3eg2i351coyuneypdsu/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9iaW5rZWl0aCIsImEiOiJjanY5MHJrd2swand1NDRucjk2MnR4ejJ1In0.8f5HJ5ZWoRPbUoWcVjaQpg

//mapbox://styles/robinkeith/cjwxqu5ke4f451cp6uyqcuhcj
const PedestrianBaseLayer =
L.tileLayer('https://api.mapbox.com/styles/v1/robinkeith/cjwxqu5ke4f451cp6uyqcuhcj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoicm9iaW5rZWl0aCIsImEiOiJjanY5MHJrd2swand1NDRucjk2MnR4ejJ1In0.8f5HJ5ZWoRPbUoWcVjaQpg', {
//maxZoom: 20,
//minZoom: 13,
attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
id: 'mapbox.streets'
})


export function createLayers(map,userSettings) {
    const emptyLayer =  L.tileLayer('');

    let layerControl= L.control.layers({
        
        "Roads": defaultBaseLayer,
        "Pedestrian": PedestrianBaseLayer,
        }, 
        {
            '<i class="fas fa-parking"></i> Get Here': parkingLayerGroup(userSettings),
            '<i class="fas fa-info-circle"></i> Get Around': emptyLayer,
            '<i class="fas fa-toilet"></i> Toilets':toiletLayerGroup(userSettings),
            '<i class="fas fa-utensils"></i> Eat and Drink':foodLayerGroup(userSettings),
            '<i class="fas fa-shopping-cart"></i> Shop':emptyLayer,
            '<i class="fas fa-hands-helping"></i> Learn':emptyLayer,
            '<i class="fas fa-smile-beam"></i> Enjoy':emptyLayer,
            
            '<i class="fas fa-exclamation"></i> <strong>Help!</strong>': helpLayerGroup(userSettings),
            //"<i>Contribute</i>":contributeLayer,
        },
        {
            collapsed:false,
            position:'topright',
    });

    layerControl.addTo(map);
    layerControl.restoreSelectedLayers();
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
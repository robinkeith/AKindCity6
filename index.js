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
    //import {OverPassLayer} from 'leaflet-overpass-layer';
    import './src/utils';
    import {contributeLayer} from './src/contribute';
    import {toiletLayerGroup} from './src/toilet';
    import {parkingLayerGroup} from './src/parking';
    import 'leaflet.restoreview';
   /* import './src/CSMapLayer';*/
    //import  './src/FeatureInfo';
    

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
            //center:[52.628533,1.291904],
            //zoom:15,
            //minZoom	:13,
            //maxZoom:20,
            maxBounds:[[52.584648,1.183911],[52.68566,1.518445]],
            fullscreenControl: true,

        });
    

    const defaultBaseLayer=
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoicm9iaW5rZWl0aCIsImEiOiJjanY5MHJrd2swand1NDRucjk2MnR4ejJ1In0.8f5HJ5ZWoRPbUoWcVjaQpg', {
        //maxZoom: 20,
        //minZoom: 13,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(map);

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

  

    const wheelchairLayer = new L.GeoJSON.AJAX("data/wheelchair.geojson",{
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon:chairMarker});
        },
    });




        L.easyButton( 'fa-user-cog', function(){
            alert("This is where you'll be able to choose settings to suit your needs.","It's All About Me");
        },"Personalise the map for me",{position: 'bottomright'}).addTo(map);

        L.easyButton( 'fa-info', function(){
            alert("The map helps everybody enjoy our Kind City. The map is brought to you by the Clare School, in association with ???? The map is built with open source libraries including ...","Norwich Access Map");
        },'About the map',{position: 'bottomright'}).addTo(map);

    var lc = L.control.locate({
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

    const emptyLayer =  L.tileLayer('');

    L.control.layers({
        
        "Roads": defaultBaseLayer,
        "Pedestrian": PedestrianBaseLayer,
        }, 
        {
            '<i class="fas fa-parking"></i> Get Here': parkingLayerGroup.addTo(map),
            '<i class="fas fa-info-circle"></i> Get Around': emptyLayer,
            '<i class="fas fa-toilet"></i> Toilets':toiletLayerGroup,
            '<i class="fas fa-utensils"></i> Eat and Drink':emptyLayer,
            '<i class="fas fa-shopping-cart"></i> Shop':emptyLayer,
            '<i class="fas fa-hands-helping"></i> Learn':emptyLayer,
            '<i class="fas fa-smile-beam"></i> Enjoy':emptyLayer,
            
            '<i class="fas fa-exclamation"></i> <strong>Help!</strong>': safePlacesLayer,
            "<i>Contribute</i>":contributeLayer,
        },
        {
            collapsed:false,
            position:'topright',
        }).addTo(map);

        if (!map.restoreView()) {
            map.setView([52.628533,1.291904], 15);
        }

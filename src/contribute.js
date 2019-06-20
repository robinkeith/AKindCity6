import 'leaflet-overpass-layer';
import 'osmtogeojson';

export const contributeLayer= new L.OverPassLayer({

    minZoom: 18,
    'query': '(node({{bbox}})[building];way({{bbox}})[building];);out qt;',
    onSuccess: function(data) {

        let geojson=osmtogeojson(data);
        //this.
/*
        let i=0;
        for(i=0;i<data.elements.length;i++) {
          let e = data.elements[i];
            console.log(e);

    
    
          let pos = new L.LatLng(e.lat, e.lon);
          let  color = 'green';
          L.circle(pos, 5, {
            color: color,
            fillColor: '#fa3',
            fillOpacity: 1,
          }).addTo(this._map);
  * /  
    }*/
      },
});

//import Nectarivore from 'leaflet-nectarivore';

/*export const contributeLayer = Nectarivore.overpass({
    //debug: true,
    minZoom: 18,
    endPoint: 'https://overpass-api.de/api',
    //query: 'node["building"]({{bbox}});way["building"]({{bbox}});relation["building"]({{bbox}});out;',
    /*query:`[out:json][timeout:25];
        (
            way[amenity="building"]({{bbox}});
            node[amenity="building"]({{bbox}});
        );
    out body;
    >; 
    out skel qt;`* /
    query: '(way["parking"]({{bbox}});node["parking"]({{bbox}}););out;',
  }); 
*/


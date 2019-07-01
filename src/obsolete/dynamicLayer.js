/**Dynamic Layer
 * Extends the L.Layer object
 * The layer is initialise with a data set that will never be directly added to the map
 * Instead, a flitered version will be used
 * 
*/

function geoJSONLayerFilter(isVisible){

  return L.geoJson(null, { 
      filter: function(feature, layer) {
          return isVisible(feature.properties);
      },
  });
      
};

let settingsFilter=geoJSONLayerFilter(settings.isVisible);

L.Control.DynamicLayer = L.Layer.extend({

//when the data is added to the map, return the current subset
  onAdd: function(map) {
    var pane = map.getPane(this.options.pane);
    this._container = L.DomUtil.create(…);

    pane.appendChild(this._container);

    // Calculate initial position of container with `L.Map.latLngToLayerPoint()`, `getPixelOrigin()` and/or `getPixelBounds()`

    L.DomUtil.setPosition(this._container, point);

    // Add and position children elements if needed

    map.on('zoomend viewreset', this._update, this);
  },
  /*filterBy:function(settings){
    
    let features = this.eachLayer(function (layer) {
      layer.bindPopup('Hello');
  });
    //features.reduce(

    //);
    //return dynamicFilter(this);
  }*/

  })
  
L.dynamicLayer = function (layers) {
  return new L.Control.DynamicLayer(layers)
}
  
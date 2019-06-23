/**Dynamic Layers Control 
 * Extends the normal layer control
 * It works in the same way only the overlay layers are filtered betfore being added to the map
 * The refresh method clears the existing layers, reapplies the filter and adds the result to the map
 * 
 * 
*/
L.Control.DynamicLayerGroup = L.LayerGroup.extend({
  filterBy:function(settings){
    
    let features = this.eachLayer(function (layer) {
      layer.bindPopup('Hello');
  });
    //features.reduce(

    //);
    //return dynamicFilter(this);
  }
  })
  
L.dynamicLayerGroup = function (layers) {
  return new L.DynamicLayerGroup(layers)
}
  
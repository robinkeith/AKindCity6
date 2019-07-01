/**Dynamic Layers Control 
 * Extends the normal layer control
 * It works in the same way only the overlay layers are filtered betfore being added to the map
 * The refresh method clears the existing layers, reapplies the filter and adds the result to the map
 * 
 * 
*/
L.Control.DynamicLayers = L.Control.Layers.extend({
  
  })

L.control.dynamicLayers = function (baseLayers, overlays, options) {
  return new L.Control.DynamicLayers(baseLayers, overlays, options)
}
  
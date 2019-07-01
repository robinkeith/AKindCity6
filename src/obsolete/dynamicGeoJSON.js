

L.Control.DynamicGeoJSON = L.GeoJSON.extend({
    

});


 
L.dynamicGeoJSON = function (masterLayer,filter) {
    return new L.DynamicGeoJSON(masterLayer,filter)
  }
    
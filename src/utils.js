import * as turf from "@turf/turf";
import FeatureInfo from './FeatureInfo.js';



/**Middleware function called on the raw data before its added to a layer */
function OSMtoTCSMdataMapper(data,featurePropsList){
    //replace any polygons with a point at centoid - with the same features
    let features =data.features;
    features.forEach( function(feature, index) {
        try {
            if (feature.geometry.type === 'Polygon') {
            let feature_centroid = turf.centroid(feature);
            feature.geometry= {type: "Point", coordinates: feature_centroid.geometry.coordinates};
            //swapout the Polygon for a point
            features[index]=feature;
            }

            //add summay tags for sections of the popup
            feature.info =new FeatureInfo(feature.properties,featurePropsList);//'changing_table,unisex,male,female,drinking_water'); 
        } catch (error) {
        console.log(error);
        }
    });
    //console.log(`returning ${data.features.length} features`)
    return data;
};

function popupFromFeatureInfo(featureInfo){
  
    console.log(JSON.stringify(featureInfo.tags));
    let availability=featureInfo.availability;
    return `
    <div class="container">
      <div class="pop-caption">${featureInfo.caption}</div>
      <div class="pop-location">${featureInfo.location}</div>
      <div class="pop-facilities">${featureInfo.facilities}</div>
      <div class="pop-availability">${availability}</div>
      <div class="pop-operator">${featureInfo.operator}</div>
      <div class="pop-report">${featureInfo.report}</div>
    </div>`
  }

  function geoJSONLayerFilter(isVisible){

    return L.dynamicGeoJSON(null, { 
        filter: function(feature, layer) {
            return isVisible(feature.properties);
        },
    });
        
  };

export function CSMLayerFactory(dataFile,featureTags,icon,filter){
    //console.log(`Loading layer ${dataFile}`)

    let chooseIcon = (icon instanceof Function)?icon: function (){return icon;};

/* Open modal & center map on marker click 	*/

    function markerOnClick(e) {
        
        let poi = e.target.feature.info;
        popupFromFeatureInfo(poi);
        $(".modal-content").html(popupFromFeatureInfo(poi));
            //'This is marker ' + JSON.stringify(e.target.feature));
        $('#infoWindow').modal('show');
        //poi.
        e.target._map.setView(e.target.getLatLng());
        //e.preventDefault();
    }


    let masterLayer= new L.GeoJSON.AJAX(dataFile,{
  
        middleware:function (data){ 
            //console.log(`Loaded ${data.features.length} features`)
            return OSMtoTCSMdataMapper(data,featureTags); },
        onEachFeature: function(feature,layer){
            layer.on('click', markerOnClick);/*bindPopup(function(feature){
                return popupFromFeatureInfo(feature.feature.info);*/
        },

        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon:chooseIcon(feature.info)});
        },
        filter:filter,
        makeBoundsAware: true,
    });

    return masterLayer; //geoJSONLayerFilter(masterLayer,userConfig.isVisible);
}
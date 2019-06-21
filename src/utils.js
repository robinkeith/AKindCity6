import * as turf from "@turf/turf";
//import * as turfHelper from "@turf/helpers";
//import { isUndefined } from 'util';
import FeatureInfo from './FeatureInfo';



export function OSMtoTCSMdataMapper(data,featurePropsList){
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
    return data;
};


export function featureToLayer(feature,layer){
    layer.bindPopup(function(feature){
        return popupFromFeatureInfo(feature.feature.info);
    },{
        autoPan:true,
        'className' : 'popupCustom',
    });
};


function popupFromFeatureInfo(featureInfo){
  
    console.log(JSON.stringify(featureInfo.tags));
    return `
    <div class="container">
      <div class="pop-caption">${featureInfo.caption}</div>
      <div class="pop-location">${featureInfo.location}</div>
      <div class="pop-facilities">${featureInfo.facilities}</div>
      <div class="pop-availability">${featureInfo.availability}</div>
      <div class="pop-operator">${featureInfo.operator}</div>
      <div class="pop-report">${featureInfo.report}</div>
    </div>`
  }

export function CSMLayerFactory(dataFile,featureTags,icon){
    return new L.GeoJSON.AJAX(dataFile,{
  
        middleware:function (data){ 
            return OSMtoTCSMdataMapper(data,featureTags); },
        
        onEachFeature: featureToLayer,
        
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon:icon});
        },
    });
}
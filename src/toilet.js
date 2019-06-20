//import {centroid} from '@turf/turf'
//import centroid from '@turf/centroid';
//import gju from 'geojson-utils';
import 'leaflet';
import * as turf from "@turf/turf";
import * as turfHelper from "@turf/helpers";
import { isUndefined } from 'util';


var toiletMarkerNo = L.ExtraMarkers.icon({
    icon: 'fa-toilet',
    markerColor: 'red', 
    shape: 'square',
    prefix: 'fa'
  });
  var toiletMarkerSome = L.ExtraMarkers.icon({
    icon: 'fa-toilet',
    markerColor: 'orange', 
    shape: 'square',
    prefix: 'fa'
  });
  var toiletMarkerYes = L.ExtraMarkers.icon({
    icon: 'fa-toilet',
    markerColor: 'green', 
    shape: 'square',
    prefix: 'fa'
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


export const toiletLayer = new L.GeoJSON.AJAX("data/toilets.geojson",{
  middleware:function(data){
      //replace any polygons with a point at centoid - with the same features
      let features =data.features;
      features.forEach( function(feature, index) {
        if (feature.geometry.type === 'Polygon') {
          let feature_centroid = turf.centroid(feature);
          feature.geometry= {type: "Point", coordinates: feature_centroid.geometry.coordinates};
          //swapout the Polygon for a point
          features[index]=feature;
        }

        //add summay tags for sections of the popup
        try {
          feature.tags =new FeatureInfo(feature.properties,'changing_table,unisex,male,female,drinking_water'); 
        } catch (error) {
          console.log(error);
        }
        

      });
      return data;
  },
  onEachFeature: function(feature,layer){
    layer.bindPopup(function(feature){
      return popupFromFeatureInfo(feature.feature.tags);
    },{
      autoPan:true,
      'className' : 'popupCustom',
    });
  },
}); 

function label(label,value, post){
  return ( value)?`<strong>{label}:</strong> {value}{post}`:'';
}


class FeatureInfo{
  constructor(properties,featureTags){
    this.tags=properties;
    this.featureTags=featureTags.split(',');
  }

  get featureTagsDescription(){

  }

  //return a labelled value if the value is valid, nothing otherwise
  label(labelName,valueName, post){

    let value='';

    try {
      value=this.tags[valueName];  
    } catch (error) {
      
    }
    
    let ret= 
      (value)?
        ( ((labelName)?`<strong>${labelName}:</strong>&nbsp;`:'') + value+ ((post)?post:'')):
        '';
    
    return ret;
  }

  get caption(){
    return this.tags.name || this.tags["addr:housename"] || this.tags["@id"];
  }

  get location(){
    return `${this.label('','addr:street')} ${this.label('Level','level')}<br/>
            ${this.label('','description','<br/>')}
            ${this.wheelchairAccessDesc}
            ${this.label('','wheelchair:description')}
    `;

  }

  get wheelchairAccessDesc(){
    switch (this.tags.wheelchair) {
      case "no":return "NO WHEELCHAIR ACCESS";
      case "yes":return "Wheelchair accessible";
      case "limited":return "Limited wheelchair access";
      default:return '';
    }
  }
  get operator(){
    return this.label('Operated By','operator');
  }
  get report(){
    return `<a href=''>Report Problem</a>`;
  }
  get availability(){
    return this.label('Opening Times','opening_hours','<div class="pop-caption">>>CURRENT STATUS<<</div>') +
    this.label('Access','access', '&nbsp;') +
    this.label('RADAR key','centralkey', '&nbsp;') +
    this.label('Fee','fee', this.tags["fee:charge"]);
    
  }
  get facilities(){
    return (
    this.label('Changing Table','changing_table',"</br>") +
    this.label('Unisex','unisex',"</br>") +
    this.label('Female','female',"</br>") +
    this.label('Male','male',"</br>") +
    this.label('Drinking Water','drinking_water'));
    //return ret;
  }

  get rawData(){
    return JSON.stringify(this.tags);
  }

}

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

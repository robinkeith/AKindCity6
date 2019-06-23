//import 'opening_hours';
import opening_hours from 'opening_hours';
//opening_hours.

function getCurrentlyOpen(featureOpeningHours){
  if (featureOpeningHours) {
    let oh = opening_hours(featureOpeningHours);
    if(oh){
      var state      = oh.getState(); // we use current date
      var unknown    = oh.getUnknown();
      var comment    = oh.getComment();
      var nextchange = oh.getNextChange();

      let currentStatus =  (getReadableState('Currently ', '', oh, true));

      if (typeof nextchange === 'undefined')
        console.log('And we will never ' + (state ? 'close' : 'open'));
      else
        currentStatus+=(' '
              + (oh.getUnknown(nextchange) ? 'maybe ' : '')
              + (state ? 'close' : 'open') + ' on ' + nextchange);
      return currentStatus;
    }
  }
}

export default class FeatureInfo{
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
      let currentStatus = getCurrentlyOpen(this.tags.opening_hours);
           
      return this.label('Opening Times','opening_hours',(currentStatus)?`<div class="pop-caption">${currentStatus}</div>`:'</br>') +
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
  
  function label(label,value, post){
    return ( value)?`<strong>{label}:</strong> {value}{post}`:'';
  }  
  



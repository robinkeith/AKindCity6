// import 'opening_hours';
// declare module 'opening_hours';
import opening_hours from 'opening_hours'
import titleCase from 'better-title-case'
//const titleCase = require('better-title-case');

let tagToIgnore =
  '@id,name,NAME,NameS,addr:housename,addr:street,addr:city,addr:country,level,description,wheelchair,wheelchair:description,operator,' +
  'opening_hours,access,centralkey,fee,fee:ChannelMergerNode,amenity,toilets:wheelchair,' +
  'OBJECTID,Opening,UPRN,lon,lat,Address,Y,X,altitudeMode,OBJECTI,key,addr:housenumber,addr:postcode' +
  'website,email,phone,source:addr, park_ride, type, Maintenance, Maxheight, Salting Ref, ' +
  ',building,toilets:disposal,addr:city,addr:country,kitchen_hours,fhrs:id,layer,dataSupplier,dataLastUpdated'.split(',')
  
let dataImprover = {
  'capacity:disabled': 'Number of Blue Badge spaces',
  'capacity:parent': 'Number of Parent and Child spaces',
  'fee:amount:per_hour': 'Carpark Charge (per hour)',
  'fee:amount': 'Carpark Charge',
  'centralkey': 'RADAR Key Required',
  'access': 'Access',
  'kitchen_hours': 'Kitchen Opening Times',
  'opening_hours': 'Opening Times',
  'addr:housenumber': '',
  'addr:street': '',
  'addr:postcode': '',
  'level': 'Level',
  'description': '',
  'wheelchair:description': '',
  'wheelchair': { label: '',
    value: function (tagValue) {
      switch (tagValue) {
        case 'no':return 'NO WHEELCHAIR ACCESS';
        case 'yes':return 'Wheelchair accessible';
        case 'limited':return 'Limited wheelchair access';
        default:return ''
                  }
    } },
  'toilets:wheelchair': 'Wheelchair Accessible Toilets',
  'fee:charge': 'Fee',
  'operator': 'Operated By'
}

function getCurrentlyOpen (featureOpeningHours) {
  try {
    if (featureOpeningHours) {
      let oh = opening_hours(featureOpeningHours)
      if (oh) {
        var state = oh.getState() // we use current date
        var unknown = oh.getUnknown()
        var comment = oh.getComment()
        var nextchange = oh.getNextChange()

        let currentStatus = (getReadableState('Currently ', '', oh, true))

        if (typeof nextchange === 'undefined')
          {console.log('And we will never ' + (state ? 'close' : 'open'));}
        else
          {currentStatus+=(' '
                + (oh.getUnknown(nextchange) ? 'maybe ' : '')
                + (state ? 'close' : 'open') + ' on ' + nextchange);}
        return currentStatus
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export default class FeatureInfo {
  constructor (properties, featureTags) {
    this.tags = properties
      //few adhoc mappings to fix up the safePlaces data
      if (this.tags.Opening) { this.tags.opening_hours = this.tags.Opening}
    if (this.tags.Name) {
      this.tags.name = this.tags.Name
      }
    if (this.tags.Address) { this.tags['addr:street'] = this.tags.Address}

    this.featureTags = featureTags.split(',')
    }

  get featureTagsDescription () {

  }

  // return a labelled value if the value is valid, nothing otherwise
  label (valueName, postValue, postLabel) {
    let value = ''
  
      try {
      value = this.tags[valueName]  
      } catch (error) {

    }

    if (!value) { return ''   }
    // look for any overrides or improvements and apply them if found
    let dataImprovement = dataImprover[valueName]
      let prettyLabel, prettyValue
      let improverType = typeof (dataImprovement)
      switch (typeof (dataImprovement)) {
      case 'string':
        prettyLabel = dataImprovement
              prettyValue = value
              break;
      case 'object':
        prettyLabel = dataImprovement.label
              prettyValue = dataImprovement.value(value)
              break;
      default:
        prettyLabel = titleCase(valueName.replace(/[:|-|_]/gi, ' '))
              prettyValue = value
      }

    // console.log(prettyLabel,prettyValue);
    let ret =
           ((prettyLabel) ? `<strong>${prettyLabel}:</strong>&nbsp;` + (postLabel || ''):'') +
           prettyValue +
           ((postValue) || '')
          
      return ret
    }

  get caption () {
    return this.tags.name || this.tags['addr:housename'] || this.tags.amenity || this.tags.building || this.tags['@id'] || ''
    }


  get location () {
    return `${this.label('addr:housenumber', ' ')} ${this.label('addr:street', ' ')} ${this.label('level', ' ')}${this.label('addr:postcode', ' ')}<br />
              ${this.label('description', '<br />')}
              ${this.label('wheelchair', ' ')}
              ${this.label('wheelchair:description')}`
  
    }
  /*
    get wheelchairAccessDesc(){
      switch (this.tags.wheelchair) {
        case "no":return "NO WHEELCHAIR ACCESS";
        case "yes":return "Wheelchair accessible";
        case "limited":return "Limited wheelchair access";
        default:return '';
      }
    } */
  get operator () {
    return this.label('operator', '<br />')// || "<strong>Information supplied by:</strong>Open Street Map";
    }

  get report () {
    return this.label('website', '<br />') +
        this.label('email', '<br />') +
        this.label('phone', '<br />')

    }

  get contact () {

  }

  // use the layer meta data to show the originator of the data and when it was last updated
  get meta () {
    let supplier = 'Unknown'; let lastUpdated = 'Unknown';
    if (this.tags['@id']) {
      let id = this.tags['@id'].replace('/', '=')
        supplier = `<a href='http://www.openstreetmap.org/edit?${id}&comment=TCSM' target='_blank' data-toggle='tooltip' title='Edit on OSM'>Open Street Map</a>`
    }
    lastUpdated = this.tags.dataLastUpdated
      return `<strong>Data From:</strong> ${supplier} <strong>on:</strong> ${lastUpdated}`
    }

  /* Use this section to list any conditions or barriers to accessing this service */
  get availability () {
    let opening = this.label('opening_hours')
      if (this.tags.opening_hours) {
      let currentStatus = getCurrentlyOpen(this.tags.opening_hours)
        if (currentStatus) {
        opening += `<div class="pop-caption">${currentStatus}</div>`
        } else {
        opening += '<br />'        
        }
    }
    opening += this.label('kitchen_hours')
           
      return opening +
      // this.label('Opening Times','opening_hours',(currentStatus)?`<div class="pop-caption">${currentStatus}</div>`:'</br>') +
      this.label('access', '&nbsp;') +
      this.label('centralkey', '&nbsp;') +
      this.label('fee:charge') +
      ((this.tags.amenity !== 'toilets') ? this.label('toilets:wheelchair'):'')
      
    }

  get facilities () {
    // return any fields not shown elsewhere
    let facList = Object.entries(this.tags).reduce((acc, [key, value]) => {
      if (!tagToIgnore.includes(key)) {
        // let keyLabel =key.replace(/[:-]/gi,' ');
        acc.push(this.label(key))
        }
      return acc
        }, [] ) 
      return facList.join('<br />')

    }

  get rawData () {
    return JSON.stringify(this.tags)
    }
}
/*
  function label(label,value, post){
    return ( value)?`<strong>{label}:</strong> {value}{post}`:'';
  } */




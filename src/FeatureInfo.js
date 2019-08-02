// import 'opening_hours';
// declare module 'opening_hours';

import titleCase from 'better-title-case'
import moment from 'moment'
// import { defaultSettings } from './defaultSettings.js'
import { getOpeningHours } from './openingHoursPool.js'

// const titleCase = require('better-title-case');

let tagToIgnore =
  '@id,name,NAME,NameS,addr:housename,addr:street,addr:city,addr:country,level,description,wheelchair,wheelchair:description,operator,' +
  'opening_hours,access,centralkey,fee,fee:ChannelMergerNode,amenity,toilets:wheelchair,mapFeature,Addr Interpolation,' +
  'OBJECTID,Opening,UPRN,lon,lat,Address,Y,X,altitudeMode,OBJECTI,key,addr:housenumber,addr:postcode,' +
  'website,email,phone,source:addr, park_ride, type, Maintenance, Maxheight, Salting Ref, ' +
  'brand,brand:wikidata,brand:wikipedia' +
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
        case 'no':return 'NO WHEELCHAIR ACCESS'
        case 'yes':return 'Wheelchair accessible'
        case 'limited':return 'Limited wheelchair access'
        default:return ''
      }
    } },
  'toilets:wheelchair': 'Wheelchair Accessible Toilets',
  'fee:charge': 'Fee',
  'operator': 'Operated By'
}
export default class FeatureInfo {
  constructor (properties, featureTags) {
    this.tags = properties
    // few adhoc mappings to fix up the safePlaces data
    /**
      if (this.tags.Opening) { this.tags.opening_hours = this.tags.Opening }
      if (this.tags.Name) {
        this.tags.name = this.tags.Name
      }
      if (this.tags.Address) { this.tags['addr:street'] = this.tags.Address }

    */
    // this.featureTags = featureTags.split(',')

    // handling for opening hours. Avoid parsing the opening hours all the time by doing it once only

    if (properties.opening_hours) {
      this.openingHours = getOpeningHours(properties.opening_hours, properties.id)
    }
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

    if (!value) { return '' }
    // look for any overrides or improvements and apply them if found
    let dataImprovement = dataImprover[valueName]
    let prettyLabel, prettyValue
    // let improverType = typeof (dataImprovement)
    switch (typeof (dataImprovement)) {
      case 'string':
        prettyLabel = dataImprovement
        prettyValue = value
        break
      case 'object':
        prettyLabel = dataImprovement.label
        prettyValue = dataImprovement.value(value)
        break
      default:
        prettyLabel = titleCase(valueName.replace(/[:|-|_]/gi, ' '))
        prettyValue = value
    }

    // console.log(prettyLabel,prettyValue);
    let ret =
           ((prettyLabel) ? `<strong>${prettyLabel}:</strong>&nbsp;` + (postLabel || '') : '') +
           prettyValue +
           ((postValue) || '')

    return ret
  }

  get caption () {
    if (this.tags.mapFeature) {
      return this.tags.mapFeature.caption || this.tags.mapFeature.hoverCaption || ''
    }
    // return this.tags.name || this.tags['addr:housename'] || this.tags.amenity || this.tags.building || this.tags['@id']
  }

  get location () {
    return this.tags.mapFeature.location || ''

  /*  return `${this.label('addr:housenumber', ' ')} ${this.label('addr:street', ' ')} ${this.label('level', ' ')}${this.label('addr:postcode', ' ')}<br />
              ${this.label('description', '<br />')}
              ${this.label('wheelchair', ' ')}
              ${this.label('wheelchair:description')}` */
  }

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

  /**
 * Return a human readable string describing the opening hours
 */
  get prettyOpeningHours () {
    if (this.openingHours) {
      return this.openingHours.prettifyValue({
        rule_sep_string: '<br/>',
        print_semicolon: false
      })
    }
  }

  /**
 * @return A human readable string describing the current state
 * Either "OPEN" or "CLOSED" in a button highlight, followed by any explanitory notes
 * OR an explanitory note
 * Followed by the time the state next changes
 */
  get prettyCurrentState () {
    let output = ''
    if (this.openingHours) {
      let openingHours = this.openingHours
      const comment = openingHours.getComment()
      const currentState = openingHours.getState()
      const nextChange = openingHours.getNextChange()

      if (openingHours.getUnknown()) {
        output = (comment ? comment + '<br/>' : '')
      } else {
        output = (currentState
          ? `<span class="btn btn-primary">OPEN</span>`
          : `<span class="btn btn-primary">CLOSED</span>`) +
        (comment ? ' Note: "' + comment + '"' : '') + '<br/>'
      }

      if (nextChange) {
        let nextChangeMoment = moment(nextChange)
        let nextChangeDuration = nextChangeMoment.fromNow()
        output +=
            (openingHours.getUnknown(nextChange) ? ' maybe ' : '') +
            (currentState ? 'Closes ' : 'Opens ') +
            nextChangeDuration +
            nextChangeMoment.format('[ (at ] h:mm a [on] dddd, MMMM Do[)]')
      }
    }

    return output
  }

  /**
 * return a closed/open indicator flag
 * @return - true if it's currently open, false inf not, and undefined if we don't know
 */
  get currentlyOpen () {
    if (this.openingHours) {
      return this.currentState
    }
  }

  // use the layer meta data to show the originator of the data and when it was last updated
  get meta () {
    let supplier = 'Unknown'; let lastUpdated = 'Unknown'
    if (this.tags['@id']) {
      let id = this.tags['@id'].replace('/', '=')
      supplier = `<a href='http://www.openstreetmap.org/edit?${id}&comment=TCSM' target='_blank' data-toggle='tooltip' title='Edit on OSM'>Open Street Map</a>`
    }
    lastUpdated = this.tags.dataLastUpdated
    return `<strong>Data From:</strong> ${supplier} <strong>on:</strong> ${lastUpdated}`
  }

  /* Use this section to list any conditions or barriers to accessing this service */
  get availability () {
    let opening = ''
    if (this.openingHours) {
      opening = `${this.prettyCurrentState}<br/><br/>
        <strong>Opening Hours:</strong> ${this.prettyOpeningHours}<br/>`
    }
    opening += this.label('kitchen_hours')

    return opening +
      // this.label('Opening Times','opening_hours',(currentStatus)?`<div class="pop-caption">${currentStatus}</div>`:'</br>') +
      this.label('access', '&nbsp;') +
      this.label('centralkey', '&nbsp;') +
      this.label('fee:charge') +
      ((this.tags.amenity !== 'toilets') ? this.label('toilets:wheelchair') : '')
  }

  get facilities () {
    // return any fields not shown elsewhere
    let facList = Object.entries(this.tags).reduce((acc, [key, value]) => {
      if (!tagToIgnore.includes(key)) {
        // let keyLabel =key.replace(/[:-]/gi,' ');
        acc.push(this.label(key))
      }
      return acc
    }, [])
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

import moment from 'moment'
import { getOpeningHours } from './openingHoursPool.js'
import $ from 'jquery'
import html from 'html-escaper'
import { getIcon } from './iconPool.js'
import copyToClipboard from 'copy-to-clipboard'
import { UserSettings } from './userSettings'

/**
 * Provides a wrapper around a feature that is used to control the dynamic elements of a marker
 */
export default class MapFeature {
  /**
   * @param {Object} properties OSM tags
   */
  constructor (properties) {
    this.tags = properties
    this.featureInfo = this.tags.mapFeature // TODO: sort what features are required
    // handling for opening hours. Avoid parsing the opening hours all the time by doing it once only
    if (properties.opening_hours) {
      this.openingHours = getOpeningHours(properties.opening_hours, properties.id)
    }
  }

  /** Initialise the featureWindow with data for the chosen marker
  * @returns void
  */
  setupInfoWindow () {
    console.log(this.tags)

    $('#infoWindowLabel').text(this.caption)
    $('.pop-location').html(this.location)
    $('.pop-description').html(this.description)
    $('.pop-facilities').html(this.facilities)
    $('.pop-availability').html(this.availability)
    $('.pop-current').html(this.current)
    // $('.pop-operator').html(featureInfo.operator)
    $('.pop-contact').html(this.contact)
    if (UserSettings.demoMode) $('.pop-meta').html(this.meta)

    let nodeRef = this.tags.id

    $('#infoWindowFeedback').on('click', function (event) {
      copyToClipboard(nodeRef)
      $('#feedback').modal()
    })
  }

  /**
   * Return a icon for the feature in it's current state
   * Accounts for:
   * * Type of feature
   * * Time of day/opening hours
   * * Other access issues based on current settings
   * This is dynamic - in the future will be used to refresh icons on a timer tick.
   * The icon pool is used to minimise the number of icons created.
   * @returns {*} Leaflet icon from the pool
   */
  get icon () {
    let openState
    let openingHours = this.openingHours
    if (openingHours && !openingHours.getUnknown()) {
      const currentState = openingHours.getState()
      // const nextChange = openingHours.getNextChange()

      openState = currentState ? 'open' : 'closed'
    }
    // TODO: caclulate next closing/opening
    let iconName = this.tags.mapFeature.icon
    let relevance = true
    let primaryLayer = (this.tags.mapFeature.layers[0] || '').split('_')[0]
    // if (primaryLayer)

    let icon = getIcon({
      layer: primaryLayer,
      type: iconName,
      openState: openState,
      relevance: relevance }, this.tags.id)

    return icon
  }
  get caption () {
    return this.featureInfo.caption
  }

  get description () {
    return this.featureInfo.description
  }

  get location () {
    return this.featureInfo.location
  }

  get contact () {
    return this.featureInfo.contact
  }

  /* Use this section to list any conditions or barriers to accessing this service */
  get availability () {
    return this.featureInfo.availability
  }

  get facilities () {
    return this.featureInfo.facilities
  }

  /* Use this section to show CURRENT access to this service - including time travel */
  get current () {
    return (this.openingHours) ? this.prettyCurrentState : ''
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
        output = (comment ? `<div>${comment}</div>` : '')
      } else {
        output = `<div class="open-sign">${currentState ? 'OPEN' : 'CLOSED'}</div>`
        if (comment) {
          output += `<div>Note: ${comment}</div>`
        }

        if (nextChange) {
          let nextChangeMoment = moment(nextChange)
          let nextChangeDuration = nextChangeMoment.fromNow()
          output += '<div>' +
              (openingHours.getUnknown(nextChange) ? ' maybe ' : '') +
              (currentState ? 'Closes ' : 'Opens ') +
              nextChangeDuration +
              nextChangeMoment.format('[ (at ] h:mm a [on] dddd, MMMM Do[)]') +
              '</div>'
        }
      }
    }

    return output
  }

  // use the layer meta data to show the originator of the data and when it was last updated
  get meta () {
    return `${this.featureInfo.meta}
      <div>${JSON.stringify(this.tags)}</div>`
    // TODO: reinstate raw hover<div data-toggle="tooltip" data-placement="bottom" title='${this.rawData}'>RAW</div>`
    // TODO: add link to ID editor
  }

  get rawData () {
    let tags = { ...this.tags }
    const tagsToRemove = ('mapFeature,name,' +
      'addr:housenumber,addr:housename,level,addr:place,addr:street,addr:postcode,addr:city,addr:country,' +
      'opening_hours,kitchen_hours,' +
      'cuisine,shop,' +
      'not:addr:postcode,' +
      'email,website,url,phone,operator').split(',')
    tagsToRemove.forEach(tag => {
      delete tags[tag]
    })

    return html.escape(JSON.stringify(tags))
  }
}

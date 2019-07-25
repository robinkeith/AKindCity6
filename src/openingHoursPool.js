// Implements a pool mechanism for openining hours objects
// import OpeningHours from 'opening_hours'
// import OpeningHours from './../node_modules/opening_hours/'
import OpeningHours from './../opening_hours.js/index.js'

import { defaultSettings } from './defaultSettings.js'
// import { opening_hours } from 'opening_hours';
// import { OpeningHours } from 'opening_hours.js';

let openingHoursPool = {}

export function getOpeningHours (openingHoursString, id) {
  let openingHoursHash = openingHoursString
  let openingHours = openingHoursPool[openingHoursHash]

  // The pool contains either a valid opening_hours object, undefined or false
  // False is a special case, where we've previously tried and failed to create a valid
  // opening_hours object from the string, so rather than trying to reparse it, just return undefined
  if (openingHours === false) { return }

  if (!openingHours) {
    try {
      openingHours = new OpeningHours(openingHoursString,
        defaultSettings.nominatim,
        { locale: 'en',
          tag_key: 'opening_hours',
          warnings_severity: 5 })
    } catch (error) {
      openingHours = false
      console.warn(`ERROR: Opening hours of "${openingHoursString}" gave error ${error} for feature ${id}`)
    }
    // If there was a problem, wite to the pool anyway
    openingHoursPool[openingHoursHash] = openingHours
  }
  return openingHours
}

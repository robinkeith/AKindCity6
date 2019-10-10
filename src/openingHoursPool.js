// @ts-nocheck
// Implements a pool mechanism for openining hours objects
// import OpeningHours from 'opening_hours'
// import OpeningHours from './../node_modules/opening_hours/'

// import { defaultSettings } from './../src/defaultSettings.js'
// const defaultSettings = require('./../src/defaultSettings.js')
// import { opening_hours, OpeningHours } from 'opening_hours';
// import OpeningHours from 'opening_hours'
// import OpeningHours from './opening_hours.js/'
import OpeningHours from './opening_hours+deps.min.js'
import defaultSettings from './defaultSettings'

// const OpeningHours = require('./../src/opening_hours+deps.min.js')

let openingHoursPool = {}

/**
 * get an object for an opening hours from the pool, or create one if it doesn't exist.
 * @param {string} openingHoursString - The opening hours string used as a key for the objects
 * @param {string} id - the feature that contained the opening hours string - for debugging only
 * @returns {OpeningHours} - pointer to OH object from the pool
 */
export function getOpeningHours (openingHoursString, id) {
// exports.getOpeningHours = function (openingHoursString, id) {
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
      console.warn(`ERROR: Opening hours of "${openingHoursString}" gave error "${error}" for feature ${id}`)
      openingHours = false
    }
    // If there was a problem, wite to the pool anyway
    openingHoursPool[openingHoursHash] = openingHours
  }
  return openingHours
}

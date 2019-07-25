import L from 'leaflet'
import { CSMLayerFactory } from './utils.js'
import blueBadgeSign from './../resources/blue_badge_paking.svg'
import parkingMeterIcon from './../resources/icons/parkingMeter.svg'
// import { generateKeyPair } from 'crypto'

let parkingMarker = L.icon({
  iconUrl: parkingMeterIcon,
  iconSize: [45, 45] // size of the icon
})

let carparkMarker = L.ExtraMarkers.icon({
  icon: 'fa-parking',
  markerColor: 'white',
  iconColor: 'blue',
  shape: 'square',
  prefix: 'fa'
})

let lageCarparkMarker = L.ExtraMarkers.icon({
  icon: 'fa-parking',
  markerColor: 'blue',
  shape: 'square',
  prefix: 'fa'
})

let taxiMarker = L.ExtraMarkers.icon({
  icon: 'fa-car',
  markerColor: 'black',
  shape: 'square',
  prefix: 'fas'
})

/**
  let disabledParkingSpacesMarker = L.ExtraMarkers.icon({
    icon: 'fa-question',
    markerColor: 'white',
    iconColor: 'gray',
    shape: 'square',
    prefix: 'fas'
  })
*/

let blueBadgeMarker = L.icon({
  iconUrl: blueBadgeSign,
  iconSize: [40, 30] // size of the icon
})
/*

Tagging
Car Park
An off-road area designated for parking cars, typically for a charge. Has a capacity, and often a number of spaces dedicated to disabled or other user groups. Can be run by a council or private company, or as an amenity for a shopping area.

amenity=parking - a node or way (but not both) representing a whole car park.
parking=type (type could be multi-storey, underground or surface (default). Could also be park_and_ride)
 parking:lane=* - Parking along the side of streets
fee=boolean (yes/no)

access= yes; customers; permissive; private
fee
supervised
capacity
capacity:disabled=
capacity:parent=
capacity:charging=
Maxstay

amenity=parking_space - used to map a single space within an amenity=parking car park. - Not used by TCSM.

amenity=pa

*/

export default function (userSettings) {
  let featureTags = ''

  let filter = function (feature) {
    if (feature.properties['access'] === 'private') return false
    if (userSettings.wheelchair) {
      if (feature.properties['access'] === 'disabled') return true
      return (feature.properties['capacity:disabled'] &&
                (feature.properties['capacity:disabled'] > 0 || feature.properties['capacity:disabled'] === 'yes'))
    } else { return true }
  }

  /**
     * choose an appropriate icon based on the feature's properties
     * @param {*} feature feature object
     */
  function chooseIcon (feature) {
    let largeCarpark = (feature.tags.capacity && feature.tags.capacity > 20)
    let publicCarpark = (feature.tags.access && feature.tags.access === 'public')

    if (largeCarpark || publicCarpark) return lageCarparkMarker
    return carparkMarker
  }

  return L.layerGroup([
    CSMLayerFactory('data/here-parkingMeters.geojson', featureTags, parkingMarker, filter),
    CSMLayerFactory('data/here-parkingSpaces.geojson', featureTags, chooseIcon, filter),
    CSMLayerFactory('data/here-taxi.geojson', featureTags, taxiMarker, filter),
    CSMLayerFactory('data/nolicence/here-blueBadgeLines.geojson', featureTags, blueBadgeMarker)
    // CSMLayerFactory('data/nolicence/here-disabledParking.geojson', featureTags, disabledParkingSpacesMarker)
    // CSMLayerFactory("data/nolicence/Datasets.zip.geojson",featureTags,disabledParkingSpacesMarker),

  ])
}

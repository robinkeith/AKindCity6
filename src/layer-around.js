import L from 'leaflet'
import { CSMLayerFactory } from './utils.js'
import redCircleSvg from '../resources/icons/redCircle.svg'
import greenCircleSvg from '../resources/icons/greenCircle.svg'
import orangeCircleSvg from '../resources/icons/orangeCircle.svg'
import blueCircleSvg from '../resources/icons/blueCircle.svg'

var redCircleMarker = L.icon({
  iconUrl: redCircleSvg, // 'resources/Changing_Place_logo.svg',
  iconSize: [25, 25] // size of the icon
})

var greenCircleMarker = L.icon({
  iconUrl: greenCircleSvg, // 'resources/Changing_Place_logo.svg',
  iconSize: [25, 25] // size of the icon
})

var orangeCircleMarker = L.icon({
  iconUrl: orangeCircleSvg, // 'resources/Changing_Place_logo.svg',
  iconSize: [25, 25] // size of the icon
})

var blueCircleMarker = L.icon({
  iconUrl: blueCircleSvg, // 'resources/Changing_Place_logo.svg',
  iconSize: [25, 25] // size of the icon
})

var mobilityMarker = L.ExtraMarkers.icon({
  icon: 'fa-wheelchair',
  iconColor: 'blue',
  markerColor: 'white',
  shape: 'square',
  prefix: 'fas'
})

export default function (userSettings) {
  let featureTags = ''

  let filter = function (feature) {
    if (feature.properties['access'] === 'private') return false
    /* if (userSettings.wheelchair) {
            if (feature.properties["access"]=="disabled") return true;
            return (feature.properties["capacity:disabled"] &&
                (feature.properties["capacity:disabled"]>0 || feature.properties["capacity:disabled"]==='yes'))

        } else */
    return true
  }

  /**
     * use a red circle to show potential obstacles, green to show aids
     * @param {*} feature feature object
     */
  function chooseIcon (feature) {
    let isObstacle = (feature.tags.highway === 'steps')

    let isImpediment = (feature.tags.incline === 'up')
    let isAid = (feature.tags.highway === 'lift' || feature.tags.elevator === 'yes' || feature.tags.wheelchair === 'designated' ||
      feature.tags.ramp || feature.tags.tactile_paving || feature.tags.conveying)

    if (isObstacle) return redCircleMarker
    if (isImpediment) {
      return orangeCircleMarker
    }
    if (isAid) return greenCircleMarker

    return blueCircleMarker
  }

  return L.layerGroup([
    CSMLayerFactory('data/around.geojson', featureTags, chooseIcon, filter),
    CSMLayerFactory('data/around-amenities.geojson', featureTags, mobilityMarker, filter)
    /* CSMLayerFactory("data/parkingMeters-hand.geojson",featureTags,parkingMarker,filter),
        CSMLayerFactory("data/parkingSpaces-hand.geojson",featureTags,carparkMarker,filter),
        CSMLayerFactory("data/taxi-hand.geojson",featureTags,taxiMarker2,filter) */
  ])
}

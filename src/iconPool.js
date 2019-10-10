// import L from 'leaflet'
// import 'Leaflet.vector-markers'
// import { Map, TileLayer, Marker } from 'leaflet';
// import VectorIcon from '../dist/leaflet-vector-icon';
// import VectorIcon from '../node_modules/leaflet-vector-icon/src/index'
import 'leaflet-svgicon'
import 'maki'
import L from 'leaflet'
// import * as color from 'color'#
import Color from 'color'

let iconPool = {}

/**
 * iconPool is responsible for creating markers and minimising the number of icons by caching them in a pool.
 * It's responsible for mapping a requirement to an icon, responsibility for mapping current status to
 * requirements is with the FeatureInfo class
 * @param {Object} requirements
 * @param {string} requirements.layer - feature type
 * @param {string} requirements.type - feature type (ie. used to generate icon)
 * @param {string} requirements.openState - open,closed,opening,closing or blank for unknown
 * @param {boolean} requirements.relevance - show,hide
 * @param {string} id - OSM (or other) primary key for the feature
 */
export function getIcon (requirements, id) {
  // Key the pool by the requirement. this means potentially more icons in the pool,
  // but avoids having to translate the requirements everytime
  let iconPoolId = `${requirements.layer}.${requirements.type}.${requirements.openState}`

  let icon = iconPool[iconPoolId]
  if (!icon) {
    icon = makeIcon(requirements)
    iconPool[iconPoolId] = icon
  }

  return icon
}

/**
 * Translate the requirements into parameters for the icon
 * @param {object} requirements
 */
function makeIcon (requirements) {
  const layerToColourMap = {
    here: 'indigo',
    about: 'green',
    toilets: '#DDCC77',
    food: 'purple',
    shop: 'cyan',
    learn: 'olive',
    enjoy: 'teal',
    help: '#882255',
    all: '#0000ff'
  }

  let colour = layerToColourMap[requirements.layer]
  if (!colour) colour = layerToColourMap.all
  let layerColour = Color(colour)
  let circleColor, iconColor

  switch (requirements.openState) {
    case 'open':
      circleColor = layerColour
      iconColor = Color('white')
      break
    case 'closed':
      circleColor = layerColour.lighten(0.8)
      iconColor = Color('black')
      break
    case 'opening':
      circleColor = layerColour.lighten(0.5)
      iconColor = Color('black')
      break
    case 'closing':
      circleColor = layerColour.lighten(0.5)
      iconColor = Color('white')
      break
    default:
      circleColor = Color('lightgray')
      iconColor = layerColour
  }

  // TODO: replace letters with icons
  let iconOptions = {
    circleText: (requirements.type || '??').substr(0, 2).toUpperCase(),
    borderColor: layerColour.hex(),
    fontColor: iconColor.hex(),
    circleFillColor: circleColor.hex(),
    fillColor: circleColor.hex(),
    circleOpacity: 0,
    weight: 2,
    circleWeight: 0.1,
    circleColor: iconColor.hex(),
    fillOpacity: 1,
    fontSize: 10,
    circleRatio: 0.6

  }
  let ico = new L.DivIcon.SVGIcon(iconOptions)
  // console.log(iconOptions, ico)

  return ico
}
/*

const iconDefaults = {
  mapIconUrl: / *
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 180">
  <g fill="#0a74ba">
    <path d="M6.96 1.35c3.1 0 5.62 2.52 5.62 5.61 0 2.07-1.54 3.72-2.46 4.72-.23.24-.42.44-.56.62-.72.93-1.9 2.57-2.6 3.57a166.95 166.95 0 0 0-2.6-3.57c-.14-.18-.33-.39-.56-.64-.92-.97-2.45-2.6-2.45-4.7 0-3.1 2.52-5.6 5.61-5.6m0-1a6.62 6.62 0 0 0-6.6 6.6c0 2.5 1.7 4.3 2.7 5.39l.04.04c.2.2.37.39.48.52a142 142 0 0 1 2.97 4.1c.04.06.1.11.15.15a.5.5 0 0 0 .67-.14c.02-.02 1.96-2.8 2.98-4.1.1-.15.29-.34.5-.57 1.02-1.1 2.72-2.93 2.72-5.39a6.62 6.62 0 0 0-6.6-6.6"/>

  </g>
  <text transform="matrix(1.01211 0 0 .98803 -7.3 -125.87)" y="136.41" x="10.38" style="line-height:1.25" font-weight="400" font-size="5.68" font-family="sans-serif" letter-spacing="0" word-spacing="0" stroke-width=".14">
    <tspan y="136.41" x="10.38">Ab</tspan>
  </text>
</svg>`,
  * /
`<svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178">
    <path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10"
    d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/>
    <circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="61"/>
    <circle fill="#FFF" cx="74" cy="75" r="{pinInnerCircleRadius}"/>
    </svg>`,

  mapIconColor: '#cc756b',
  mapIconColorInnerCircle: '#fff',
  pinInnerCircleRadius: 48
}
*/
// let counter = 0
/*
function divIcon (mapIconColor) {
  return L.divIcon({
    className: 'leaflet-data-marker',
    html: L.Util.template(iconDefaults.mapIconUrl, { ...iconDefaults, counter: counter++, mapIconColor: mapIconColor }), // .replace('#','%23'),
    iconAnchor: [12, 32],
    iconSize: [25, 30],
    popupAnchor: [0, -28]
  })
}
*/

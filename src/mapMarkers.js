import L from 'leaflet'
// import { color } from 'color'

/**
 * Encodes an SVG string so in can be used as an URI
 * @param {string} svgString SVG to be encoded
 */
export function encodeSVG (svgString) {
  /*
    For data URI SVG support in Firefox & IE it's necessary to URI encode the string
    & replace the '#' character with '%23'. `encodeURI()` won't do this which is
    why `replace()` must be used on the string afterwards.
    */
  return encodeURI('data:image/svg+xml,' + svgString).replace('#', '%23')
}

// mapIconUrl: <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 149 178"><path fill="{mapIconColor}" stroke="#FFF" stroke-width="6" stroke-miterlimit="10" d="M126 23l-6-6A69 69 0 0 0 74 1a69 69 0 0 0-51 22A70 70 0 0 0 1 74c0 21 7 38 22 52l43 47c6 6 11 6 16 0l48-51c12-13 18-29 18-48 0-20-8-37-22-51z"/><circle fill="{mapIconColorInnerCircle}" cx="74" cy="75" r="61"/><circle fill="#FFF" cx="74" cy="75" r="{pinInnerCircleRadius}"/></svg>

const iconSettings = {
  mapIconUrl: /*
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 180">
  <g fill="#0a74ba">
    <path d="M6.96 1.35c3.1 0 5.62 2.52 5.62 5.61 0 2.07-1.54 3.72-2.46 4.72-.23.24-.42.44-.56.62-.72.93-1.9 2.57-2.6 3.57a166.95 166.95 0 0 0-2.6-3.57c-.14-.18-.33-.39-.56-.64-.92-.97-2.45-2.6-2.45-4.7 0-3.1 2.52-5.6 5.61-5.6m0-1a6.62 6.62 0 0 0-6.6 6.6c0 2.5 1.7 4.3 2.7 5.39l.04.04c.2.2.37.39.48.52a142 142 0 0 1 2.97 4.1c.04.06.1.11.15.15a.5.5 0 0 0 .67-.14c.02-.02 1.96-2.8 2.98-4.1.1-.15.29-.34.5-.57 1.02-1.1 2.72-2.93 2.72-5.39a6.62 6.62 0 0 0-6.6-6.6"/>

  </g>
  <text transform="matrix(1.01211 0 0 .98803 -7.3 -125.87)" y="136.41" x="10.38" style="line-height:1.25" font-weight="400" font-size="5.68" font-family="sans-serif" letter-spacing="0" word-spacing="0" stroke-width=".14">
    <tspan y="136.41" x="10.38">Ab</tspan>
  </text>
</svg>`,
  */
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

// <path d="M11.4 6.87c0-2.49-1.98-4.5-4.44-4.5a4.48 4.48 0 0 0-4.44 4.5c0 2.5 1.99 4.51 4.44 4.51a4.48 4.48 0 0 0 4.45-4.5"/>
var counter = 0

// icon normal state
export function divIcon (mapIconColor) {
  return L.divIcon({
    className: 'leaflet-data-marker',
    html: L.Util.template(iconSettings.mapIconUrl, { ...iconSettings, counter: counter++, mapIconColor: mapIconColor }), // .replace('#','%23'),
    iconAnchor: [12, 32],
    iconSize: [25, 30],
    popupAnchor: [0, -28]
  })
}

/*
// icon active state
var divIconActive = L.divIcon({
 className: "leaflet-data-marker",
  html: L.Util.template(iconSettings.mapIconUrl, iconSettings), //.replace('#','%23'),
  iconAnchor  : [18, 42],
  iconSize    : [36, 42],
  popupAnchor : [0, -30]
});

function setActiveIcon(marker) {
  marker.setIcon(divIconActive);
};

var marker = L.marker(e, {
  icon: divIcon,
  id: i
});

locationLayer.addLayer(marker);

  marker.on('mouseover', function(e){
    if (iMarker == i) return;
    setTimeout(setActiveIcon, 10, this);
    if (iMarker >= 0) markerArray[iMarker].setIcon(divIcon);
    iMarker = i;
  });

  marker.on('mouseout', function(e){
    this.setIcon(divIcon);
    iMarker = -1;
  });

  markerArray[i] = marker;
});

locationLayer.addTo(map);

$('button').on('click', function(e){
  if (iMarker >= 0) markerArray[iMarker].setIcon(divIcon);
  markerArray[this.innerText].setIcon(divIconActive);
  iMarker = this.innerText;
});

*/

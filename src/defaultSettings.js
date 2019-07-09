import L from 'leaflet'
// defines global defaults for the map
export const defaultSettings = {
  mapCentre: [52.628533, 1.291904], // centre on Norwich
  // limit to the city centre.
  maxBounds: L.latLngBounds([[52.619751159, 1.2836123272], [52.6368392363, 1.3110438066]]),
  maxZoom: 20,
  minZoom: 15,

  zoom: 16,
  activeLayers: ['Roads']

}

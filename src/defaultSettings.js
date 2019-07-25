import L from 'leaflet'
// defines global defaults for the map
export const defaultSettings = {
  mapCentre: [52.628533, 1.291904], // centre on Norwich
  // limit to the city centre.
  maxBounds: L.latLngBounds([[52.619751159, 1.2836123272], [52.6368392363, 1.3110438066]]),
  maxZoom: 20,
  minZoom: 15,

  zoom: 16,
  activeLayers: ['Roads'],
  // https://nominatim.openstreetmap.org/reverse?format=json&lat=49.5487429714954&lon=9.81602098644987&zoom=5&addressdetails=1
  //  nominatim: { 'place_id': 198282901, 'licence': 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright', 'osm_type': 'relation', 'osm_id': 58447, 'lat': '52.7954791', 'lon': '-0.540240286617432', 'display_name': 'England, United Kingdom', 'address': { 'state': 'England', 'country': 'United Kingdom', 'country_code': 'gb' }, 'boundingbox': ['49.674', '55.917', '-6.7047494', '2.0919117'] }
  nominatim: { 'place_id': 198282901, 'licence': 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright', 'osm_type': 'relation', 'osm_id': 58447, 'lat': '52.7954791', 'lon': '-0.540240286617432', 'display_name': 'England, United Kingdom', 'address': { 'state': 'England', 'country': 'United Kingdom', 'country_code': 'gb' }, 'boundingbox': ['49.674', '55.917', '-6.7047494', '2.0919117'] }
}

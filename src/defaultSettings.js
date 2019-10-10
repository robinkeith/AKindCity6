/** defines global defaults for the map
Ideally I'd like to use leaflet defined long/lat classes, but they aren't exported, which means using them imports the whole of leaflet,
which breaks on the node.js because leaflet needs window defined and that's only present in the browser
import { latLngBounds, latLng } from 'leaflet'
*/

export default {
  // limit to Norwich city centre, centered on City Hall. This can be used to generate a L.latLngBounds
  mapCentre: [52.628533, 1.291904], // use with leaflet like this: latLng(defaultSettings.mapCentre[0], defaultSettings.mapCentre[1])
  maxBounds: [[52.619751159, 1.2836123272], [52.6368392363, 1.3110438066]], // latLngBounds(defaultSettings.maxBounds)
  maxZoom: 20,
  minZoom: 15,

  zoom: 16,
  activeLayers: ['Roads'],
  // https://nominatim.openstreetmap.org/reverse?format=json&lat=49.5487429714954&lon=9.81602098644987&zoom=5&addressdetails=1
  //  nominatim: { 'place_id': 198282901, 'licence': 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright', 'osm_type': 'relation', 'osm_id': 58447, 'lat': '52.7954791', 'lon': '-0.540240286617432', 'display_name': 'England, United Kingdom', 'address': { 'state': 'England', 'country': 'United Kingdom', 'country_code': 'gb' }, 'boundingbox': ['49.674', '55.917', '-6.7047494', '2.0919117'] }
  nominatim: { 'place_id': 198282901, 'licence': 'Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright', 'osm_type': 'relation', 'osm_id': 58447, 'lat': '52.7954791', 'lon': '-0.540240286617432', 'display_name': 'England, United Kingdom', 'address': { 'state': 'England', 'country': 'United Kingdom', 'country_code': 'gb' }, 'boundingbox': ['49.674', '55.917', '-6.7047494', '2.0919117'] }
}

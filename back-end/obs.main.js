const OverpassFrontend = require('overpass-frontend')

// you may specify an OSM file as url, e.g. 'test/data.osm.bz2'
const overpassFrontend = new OverpassFrontend('//overpass-api.de/api/interpreter')

//[bbox:,,,] long/lat
// request restaurants in the specified bounding box
overpassFrontend.BBoxQuery(
  'nwr[amenity=restaurant]',
  { minlat: 52.578228, maxlat: 52.693864, minlon:1.171761 , maxlon:1.525726  },
  {
    properties: OverpassFrontend.ALL
  },
  function (err, result) {
    console.log('* ' + result.tags.name + ' (' + result.id + ')'+ JSON.stringify( result.tags ))
  },
  function (err) {
    if (err) { console.log(err) }
    console.log("final callback called")
  }
)
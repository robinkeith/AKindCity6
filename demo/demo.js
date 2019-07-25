// “Mapbox GL JS is a JavaScript library that uses WebGL to render interactive maps from vector tiles and Mapbox styles.” -- https://www.mapbox.com/mapbox-gl-js/api/
mapboxgl.accessToken = 'pk.eyJ1IjoidXgiLCJhIjoiY2l2Zm5xZmE2MDAzOTJvcGZ4dngwbWw2aSJ9.XhTQ80_U9ZWsoqzqxHDEwQ'

if (!mapboxgl.supported()) { // https://www.mapbox.com/mapbox-gl-js/plugins/#mapbox-gl-supported
  alert('Your browser does not support Mapbox GL')
} else {
  var mbStyleStr8 = 'mapbox://styles/mapbox/streets-v8' // Streets v8
  var mbStyleStr9 = 'mapbox://styles/mapbox/streets-v9'
  var mbStyleOutd = 'mapbox://styles/mapbox/outdoors-v9'
  var mbStyleLight = 'mapbox://styles/mapbox/light-v9'
  var mbStyleDark = 'mapbox://styles/mapbox/dark-v9'
  var mbStyleBright = 'mapbox://styles/mapbox/bright-v9'

  var lnglatTallinn = [24.753574, 59.436960] // Tallinn
  var lnglatTallinnTvtower = [24.8875, 59.471206] // Tallinn TV Tower
  var lnglatTallinnTownhall = [24.745319, 59.437372] // Tallinn Town Hall
  var lnglatTallinnTowers = [24.757888, 59.433184] // Tallinn city
  var lnglatTallinnSkype = [24.661038, 59.397467] // near Skype office in Tallinn

  var angleTallinnTownhall = {
    center: lnglatTallinnTownhall,
    zoom: 17.5, // 15 is the min. zoom level showing the whole 3D buildings layer
    pitch: 60, // pitch (tilt) of the map, measured in degrees away from the plane of the screen (0-60)
    bearing: -150 // bearing (rotation) of the map, measured in degrees counter-clockwise from north
  }
  var angleTallinnTowers = {
    center: lnglatTallinnTowers,
    zoom: 15.5,
    pitch: 55,
    bearing: -50
  }
  var angleTallinnTvtower = {
    center: lnglatTallinnTvtower,
    zoom: 16,
    pitch: 30,
    bearing: -220
  }
  var angleTallinnSkype = {
    center: lnglatTallinnSkype,
    zoom: 17,
    pitch: 30,
    bearing: -225
  }

  var map = new mapboxgl.Map({

    container: 'map',
    style: mbStyleStr9,

    center: angleTallinnTownhall.center,
    zoom: angleTallinnTownhall.zoom,
    pitch: angleTallinnTownhall.pitch,
    bearing: angleTallinnTownhall.bearing

  })

  var currentLng, currentLat, currentZoom, currentPitch, currentBearing

  var logMapProps = function () {
    var centerObj = map.getCenter()
    currentLng = centerObj['lng']
    currentLat = centerObj['lat']

    currentZoom = map.getZoom()
    currentPitch = map.getPitch()
    currentBearing = map.getBearing()

    $('#log-lng').html(parseFloat(currentLng.toFixed(6)))
    $('#log-lat').html(parseFloat(currentLat.toFixed(6)))
    $('#log-zoom').html(parseFloat(currentZoom.toFixed(6)))
    $('#log-pitch').html(parseFloat(currentPitch.toFixed(6)))
    $('#log-bearing').html(parseFloat(currentBearing.toFixed(6)))
  }

  var flyStart = angleTallinnTowers

  var $flyBtn = $('#fly')

  map.on('load', function () {
    map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building', // building-height data from OpenStreetMap
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      // 'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#aaa', // #aaa === 33% black
        'fill-extrusion-height': {
          'type': 'identity',
          'property': 'height'
        },
        'fill-extrusion-base': {
          'type': 'identity',
          'property': 'min_height'
        },
        'fill-extrusion-opacity': 0.5
      }
    })

    logMapProps()

    setTimeout(function () {
      map.flyTo({ // https://www.mapbox.com/mapbox-gl-js/api/#Map#flyTo

        center: flyStart.center,
        zoom: flyStart.zoom,
        pitch: flyStart.pitch,
        bearing: flyStart.bearing,

        speed: 0.65, // make the flying slow (default: 1.2)
        curve: 0.95, // change the speed at which it zooms out (default: 1.42)

        easing: function (t) {
          return t
        }

      })

      setTimeout(function () { $flyBtn.show() }, 4000)
    }, 1500)
  })

  var isAtStart = true
  var nextIsSkype = true
  var flyTarget

  $flyBtn.on('click', function () {
    // Switch b/w points A/B/C, and set the corresponding flags
    isAtStart ? (
      flyTarget = nextIsSkype ? angleTallinnSkype : angleTallinnTvtower,
      nextIsSkype = !nextIsSkype,
      isAtStart = !isAtStart
    ) : (
      flyTarget = flyStart,
      isAtStart = !isAtStart
    )

    map.flyTo({

      center: flyTarget.center,
      zoom: flyTarget.zoom,
      pitch: flyTarget.pitch,
      bearing: flyTarget.bearing,

      speed: 0.35,
      curve: 0.7,

      easing: function (t) {
        return t
      }

    })
  })

  map.on('move', function () {
    logMapProps()
  })
}

// import { workbox } from 'workbox-cli'
import defaultSettings from './src/defaultSettings'
import xyz from 'xyz-affair'

/* precache tiles for area covered by the map in service worker as background task, including all zoom levels
   look at vector vs bitmapped tiles fo space
bounds = [
  [ minimum longitude (west), minimum latitude (south) ],
  [ maximum longitude (east), maximum latitude (north) ]]
*/

let bounds = defaultSettings.maxBounds

for (let zoom = defaultSettings.minZoom; zoom <= defaultSettings.maxZoom; zoom ++) {
  tiles = xyz(bounds,zoom)
}


// TODO: precache tiles for area covered by the map in service worker as background task, including all zoom levels
// look at vector vs bitmapped tiles fo space
// review mapbox T&Cs to check this is ok
getTileUrls (map, bounds, tileLayer, zoom)

// bacground sync will queue any requests made offline and retry them for 24 hours in the hope we get a connection
const bgSyncPlugin = new workbox.backgroundSync.Plugin('myQueueName', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
})

// caching for mapbox tiles
workbox.routing.registerRoute(
  /https:\/\/[abcd]\.tiles\.mapbox\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'map-tile-cache',
    plugins: [bgSyncPlugin]
  })
)

/**
Any of the following may also be useful

// The sources, style.json and sprites
workbox.routing.registerRoute(
  /https:\/\/api\.mapbox\.com\/(styles|v4)/,
  new workbox.strategies.StaleWhileRevalidate({
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
)

// The font glyphs
workbox.routing.registerRoute(
  /https:\/\/api\.mapbox\.com\/fonts/,
  new workbox.strategies.CacheFirst()
)

// Mapbox js & css
workbox.routing.registerRoute(
  /https:\/\/api\.tiles\.mapbox\.com\/mapbox-gl-js/,
  new workbox.strategies.CacheFirst()
)

// Polyfill
workbox.routing.registerRoute(
  /https:\/\/polyfill\.io\/v2/,
  new workbox.strategies.CacheFirst({
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  })
)

 */

// TODO: do we need this?
// TODO: mechanism to loop over all the tiles required in the map bounds at all zoom levels
// workbox.precaching.precacheAndRoute([])

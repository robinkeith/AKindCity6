
// import L from 'leaflet'
import { marker, Point } from 'leaflet'
// import * as turf from '@turf/turf'
import $ from 'jquery'

import FeatureInfo from './MapFeature.js'

// import { description } from './dataFormat';

export function getTileUrls (map, bounds, tileLayer, minZoom, maxZoom) {
  let urls = []
  for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
    let min = map.project(bounds.getNorthWest(), zoom).divideBy(256).floor()
    let max = map.project(bounds.getSouthEast(), zoom).divideBy(256).floor()

    for (var i = min.x; i <= max.x; i++) {
      for (var j = min.y; j <= max.y; j++) {
        let coords = new Point(i, j)
        coords.z = zoom
        urls.push(tileLayer.getTileUrl(coords))
      }
    }
  }
  return urls
}

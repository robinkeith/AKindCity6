
import $ from 'jquery'
import popper from 'popper.js'
import bootstrap from 'bootstrap'
import 'bootstrap/js/dist/tooltip'
import './app.scss'
import '@fortawesome/fontawesome-free' // free-solid-svg-icons
import '@fortawesome/fontawesome-free/css/all.css'
import '/node_modules/leaflet/dist/leaflet.css'

import './modern-ui.css'
import './index.css'
import './utils.js'
import { UserSettings } from './userSettings.js'
import defaultSettings from './defaultSettings.js'
import { setup } from './map.js'
import { takeTour } from './tourMap.js'
// import registerServiceWorker from './register-service-worker'

// TODO: Fix service worker registration
// TODO: Support hover captions when appropriate (e.g. not touch, mouse hover)

window.$ = window.jQuery = $
window.bootstrap = bootstrap
window.popper = popper

// registerServiceWorker()

/* -------------------jQuery document ready ------------------------------------- */
$(function () {
  /* ----------------------------------------Create the map---------------------------------------- */

  let userSettings = new UserSettings()
  let map = setup(defaultSettings, userSettings)
  /* -------------------Map Logo-------------------------------------------------------------------- */
  var mapControlsContainer = document.getElementsByClassName('leaflet-bottom leaflet-left')[0]
  var logoContainer = document.getElementById('logoContainer')
  mapControlsContainer.appendChild(logoContainer)

  $('[data-toggle="tooltip"]').tooltip({
    trigger: 'hover',
    container: 'body'
  })

  // tweak the buttons so the colour is applied to the parent
  $('.leaflet-control-layers-overlays label i')
    .each(function (index, el) {
      $(this).parents('label').css('background-color', $(this).css('background-color'))
    })

  // Close modal on map click
  map.on('click', function (e) {
    $('.modal').modal('hide')
  })

  takeTour(userSettings)
})

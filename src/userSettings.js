import html from 'html-escaper'
import $ from 'jquery'
import store from 'store2'
window.$ = window.jQuery = $

const SETTINGS_KEY = 'userSettings'

export class UserSettings {
  constructor () {
    // object asign used to copy properties fom a default object, then overwrite with an object from local settings (if there is one)
    Object.assign(this,

      {
        userName: '',
        simpleMode: false,
        pictureMode: false,
        wheelchair: false,
        limitedMobility: false,
        radarKey: false,
        dementia: false,
        assistanceDog: false,
        hoistRequired: false,
        vulnerable: false,
        demoMode: false,
        hasToured: false,
        _map: undefined
      },
      JSON.parse(store.get(SETTINGS_KEY))
    )
  }

  set layerControl (layerControl) {
    this._layerControl = layerControl
  }

  isVisible (properties) {
    return (this.wheelchair && properties.wheelchair === 'yes')
  }

  /**
     * Save user settings to local storage
     */
  save () {
    store.set(SETTINGS_KEY, JSON.stringify(this, function (key, value) {
      return (key.startsWith('_')) ? undefined : value
    }))
  }

  initUserSettingsForm () {
    $('#fg-name').toggle(!this.demoMode)

    $('#userName').val(html.escape(this.userName || ''))
    $('#switchSimple').prop('checked', this.simpleMode)
    $('#switchPics').prop('checked', this.pictureMode)
    $('#switchWheelchair').prop('checked', this.wheelchair)
    $('#switchLimitedMobility').prop('checked', this.limitedMobility)
    $('#switchRADAR').prop('checked', this.radarKey)
    $('#switchDementia').prop('checked', this.dementia)
    $('#switchDog').prop('checked', this.assistanceDog)
    $('#switchHoist').prop('checked', this.hoistRequired)
    $('#switchVulnerable').prop('checked', this.vulnerable)
    $('#keyVulnerable').toggle(!this.vulnerable)

    $('#switchDemo').prop('checked', this.demoMode)
  }

  // Add an event handler to the settings form submit button to store the values and close the form
  setupSettingsFormSubmit () {
    let userSettings = this
    $('#settings-form').on('submit', function (event) {
      event.preventDefault()
      userSettings.userName = $('#userName').val()
      userSettings.simpleMode = $('#switchSimple').prop('checked')
      userSettings.pictureMode = $('#switchPics').prop('checked')
      userSettings.wheelchair = $('#switchWheelchair').prop('checked')
      userSettings.limitedMobility = $('#switchLimitedMobility').prop('checked')
      userSettings.radarKey = $('#switchRADAR').prop('checked')
      userSettings.dementia = $('#switchDementia').prop('checked')
      userSettings.assistanceDog = $('#switchDog').prop('checked')
      userSettings.hoistRequired = $('#switchHoist').prop('checked')
      userSettings.vulnerable = ($('#switchVulnerable').prop('checked') && $('#keyVulnerable').val() === 'safe')
      userSettings.demoMode = $('#switchDemo').prop('checked')
      userSettings.save()
      if (userSettings._layerControl) {
        userSettings._layerControl.refreshLayers(userSettings)
      }

      $('#personalSettings').modal('hide')
    })
  }
}

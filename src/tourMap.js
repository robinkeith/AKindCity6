import Tour from 'tour'
import '/node_modules/tour/dist/tour.css'
// import { UserSettings } from './userSettings.js'

const tour = {
  canExit: true,
  mask: {
    scrollThrough: false
  },
  // framework: 'bootstrap4', // or "bootstrap4" depending on your version of bootstrap
  steps: [{
    // target: '#logoContainer',
    placement: ['top'],
    title: 'Welcome',
    content: `<p>Welcome to The Clare School Map Prototype.</p>
         <p>To take a quick tour around the app, click Next.</p>
         <p>We will keep your personalisation choices on this device. <br/>
         We may collect anonymised information on how you use the app.<br/> 
         If you keep using the app, we'll assume that's all fine with you.<p>`
  }, {
    target: '#logoContainer',
    placement: ['top'],
    title: 'Using the Map',
    content: `You can move around the map by dragging if you have a touch-screen device, or using the arrow keys.<br/><br/>
            Zoom in and out of the map by pinching your fingers in and out on touch-screen or using the plus and minus keys<br/><br/>
            Tap or click on the map markers for more information.`
  }, {
    target: '.leaflet-control-layers',
    title: 'Feature Groups',
    content: `We have organised the information into groups.<br/><br/>
            Tap these buttons to see each group, and tap again to hide them.<br/><br/>
            Tap or click on the markers for more information.<br/><br/>
            Tap close when you are finished.`
  }, {
    target: '#personaliseButton',
    title: 'Personalise',
    content: `Yoy can tell us about your accessibility needs by pressing this button.<br/><br/>
            Tap the switches that apply. Press Save.<br/><br/>
            The map will adapt to you.<br/><br/>
            Work in progress - We will make this more helpful in the future!`
  }, {
    target: '.search-input+input',
    title: 'Search',
    content: `Type in a place you want to find here.<br/><br/>
            We will show some matches.<br/><br/>
            Tap to show where the place is.<br/><br/>
            Work in progress - We will make this more helpful in the future!`
  }, {
    target: '#rememberButton',
    title: 'Elephant Juice',
    content: `Tap the elephant to take a quick note.<br/><br/>
            Use it when you first arrive in the city to remember which car park and level you parked on, or the Park and Ride.<br/><br/>
            Makes getting home easier!`
  }, {
    target: '.leaflet-control-locate',
    title: 'Where am I?',
    content: `Tap the pointer to see where you are.<br/><br/>
            Your device will ask for permission.<br/><br/>
            This will only work when you are in the city.`
  }, {
    target: '#logoContainer',
    placement: ['top'],
    title: 'Enjoy',
    content: `Have fun using the map.<br/><br/>
            It is just a prototype, so please don't rely on the information.<br/><br/>
            If you have any comments or improvements - or want to get involved in updating the information please contact us.<br/><br/>
            Thank you!`
  }

  ]
}

export function takeTour (userSettings, forceTour) {
  if (forceTour || !userSettings.hasToured) {
    try {
      Tour.start(tour)
        .then(() => {
          console.log('Tour Finished!')
          userSettings.hasToured = true
          userSettings.save()
        },
        (error) => {
          userSettings.hasToured = true
          userSettings.hasTouredWithError = error
          userSettings.save()

          console.log('Tour Interrupted!')
        })
    } catch (error) {
      console.log(error)
      userSettings.hasToured = true
      userSettings.hasTouredWithError = error
      userSettings.save()
    }
  }
}

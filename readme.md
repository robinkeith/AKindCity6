## Norwich: A Kind City
### Instaltion and Build

Fork the Repo from GitHub.
The latest version is in the **master** branch, and the latest deployment in **gh-pages** branch

Install dependencies with:
`````
npm install
npm install -g parcel-bundler
`````

For a local sever:
`````nmp start`````

To Deploy to Github.io:
`````npm run deploy`````

The demo page is: https://robinkeith.github.io/AKindCity6


The build and deploy processes include copying all files in the **data** folder to the **dist** folder

The following can be ignored:
 WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@
  It occurs because fsevents is an optional dependency, used only when project is run on macOS environment (the package provides 'Native Access to Mac OS-X FSEvents'). And since you're running your project on Windows, fsevents is skipped as irrelevant.

  ## Favicon and App icons
  Generated using https://realfavicongenerator.net/
  using the resources/tcsm_pointer.svg 

  The process generates a zip file of icons. Unip them to the root of the project folders.
  
  ## Data Import 
  Contained in the /back-end/ folder. 
  Run Debug task 'download' to refresh data from OSM.

  
 ## PWA Functionality
 Plan:
 * Create a Service Worker
 * Mobile first layout
 * Offline map tiles

 ### Service worker

Generate a Complete Service Worker with Workbox CLI https://developers.google.com/web/tools/workbox/guides/generate-service-worker/cli

npm install workbox-cli --save-dev
workbox wizard

Uses parcel-plugin-workbox to inject workbox into the seup. parcel-plugin-sw was oiginally used, but no longer.
parcel-plugin-workbox uses the workbox property in package.json, but we use the defaults.
`````
"workbox": {
  importScripts: ['./worker.js'],           // scripts to import into `sw.js`
  globDirectory: './dist',                  // directory to cache (usually output dir)
  globPatterns: [                           // file types to include
  '**/*.{css,html,gif,js,jpg,png,svg,webp}'
}
`````

For reference, the plugin-sw config which is no longer used
"commented_cache - not used": {
    "inDev": true,
    "strategy": "inject",
    "swSrc": "src/service-worker-templates.js",
    "swDest": "map-service-worker.js"
  },

### Potential candidates for other layer styles
 https://openmaptiles.github.io/klokantech-3d-gl-style/#17/52.62690/1.29217/-42.5/57 
 https://openmaptiles.org/styles/
 

## Opening Hours
The OSM opening hours format is quite complex.  The npm package opening_hours is comprehensive,
but out of date, so we use the git repo instread
`````
npm i github:opening-hours/opening_hours.js.git#master
````

npm cache clean --force

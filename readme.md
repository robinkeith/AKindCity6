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
`````npm start`````

To Deploy to Github.io:
`````npm run deploy`````

The demo page is: https://robinkeith.github.io/AKindCity6

### Build Process
The project does not have a sever-side component - at runtime everything is contained within a single client-side page (and a service worker). Maptiles are provided by Mapbox and points of interest data is provided by static files of data. 

There is an offline process to generate the data files from extracts of OSM data, which is processed to improve readability. The offline data import is contained in the /backend directory, and run using Debug > Import. The import process runs in a local nodejs, long term this will be run automatically each day/week on a server.  Data files are generated in the /data directory. The process also generates some statistics files in /data/csv and uses /data/temp to store files during processing.

The build process uses ParcelJS, which is a bundler similar to Webpack.  It is largely auto configuring, although there are couple of plug-ins required (and configured by package.json). ParcelJS uses Bable unde the hood to transpile for the browser.
The code uses ES module notation for imports (eg. import * from XXXX) rather than commonJS (ie. var xxx=require(XXXX)) which will transpiled as needed. In theory this should minimise the volume of code in the final bundle....
Resolving incompatabilities between libraries using the two import methods has been one of the biggest challenges in the project - especially when sharing between the from and backends, the openinghours module and Leaflet. Leaflet still appears to be including everything, and needs further work to determine why.
Although npm libraries have been used for the most part, there are some modules which are pulled directly from github forks. Opening hours was particually tricky as npm does yet contain a version which includes uk PH dates.
Leaflet.vectoricons - the npm version is pinned to leaflet 0.7

Leaflet's plug-in mechanism is a bit tricky to use with ES modules. Plug-ins need to have been tweaked to use the universal module loader code mentioned on the leaflet site. Some projects have, but not all. Also note subtle changes in the project names (e.g. caps changes and . changed to -) are significant. The project uses jsdoc as a step towards full typescript, and the plug-ins tend not to play well with that.

The build and deploy processes include copying all files in the **data** folder to the **dist** folder
The build process also clears the build cache and dist folder. This is to avoid occasional problems with the build failing due to cache issues. Although this slows the build, it's not too noticeable as most changes are hot reloadable.

The following can be ignored:
 WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@
  It occurs because fsevents is an optional dependency, used only when project is run on macOS environment (the package provides 'Native Access to Mac OS-X FSEvents'). And since you're running your project on Windows, fsevents is skipped as irrelevant.

  ## Favicon and App icons
  Generated using https://realfavicongenerator.net/
  using the resources/tcsm_pointer.svg 

  The process generates a zip file of icons. Unip them to the root of the project folders.
  
 ## Data Import 
 Data for the map is exported from OSM in an offline process. 
 The process is in the /downloader folder. The process has a main entry point of index.js which is a wrapper for main.js which allows a compatability layer for ESM modules.

 To run the process, open a terminal and from the root folder:
 `````
 npm run down
`````
 This generates some summary and stats files, and a data file in /data/all.geojson
  
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

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
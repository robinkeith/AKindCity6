# Change Log

# Version 2
## Version 2.0
Goals: Improve presentation of map features
* Improved opening hours, easier to read, expands abbreviations. Accomodates new OSM tags for kitchen hours etc
* Moved 'currently open/closed' to right hand side and made more prominent
* Improved display of location/address

TODO:
1. Generate description in postprocessing. Replace current list of tags with readable descriptions, customised for the type of attribute
2. Include safe places and blue badge in postprocessin
3. Add hover captions, improve when to display popup vs hover
4. Hide website, phone + email links with icoms
5. Introduce specific icons for shop, help and enjoy types
6. Allow filtering of layer by type
7. Highlight the 'nearest' when tracking is on.
8. Dim currently closed features, part dim closing soon features
9. Time travel - move map back and forward in time to show when things open.


## 1.9
* Improvements to 'get around' layer - colour coding added - red for obsticles (stairs), green for aids (lifts, ramps, tactile surfaces etc), amber for impediments (e.g. steep inclines)
* Added feedback form - press the 'speech bubble icon' links to the online surveys
* Added feedback button to popup window. The OSM ref is copied to the clipboard. Updated suveys to prompt for the reference
* fixed a bug in personalisation screen and loading one of the toilet layers
* fixed bug where caption showed previous POI if the new point had no caption.
* Data preprocessing colapses outlines to points automatically
* Moved polygon to point conversion to overpass query - reduces layer loading time.
* Move name tidy to preprocessing to reduce layer load time.
* Improved toolbar display on laptops and larger screen sizes
* Implemented basic service worker for PWA compatability. Map data is cached off-line. Map tiles visited will be for offline use but not yet downloading all tiles
* Opening Hours improvements, shows if places are currently open or close and next opening/closing time.
* Improvements to OSM data, added opening hours, website + email details, fixed out of date tags, and added 3d info for large number of city centre places.
Known issues: The 'Get Around' layer data for crossings etc is missing


## 1.8
* Added Elephant Juice! Press the elephant button to remember where you parked.
* Blue badge parking info - imported but not on preview website due to licencing restrictions (being worked through with NCC)
* Reorganised Parking icons to show parking meters and large car parks more clearly.
* As requested by NCC, the SafePlaces data now requires a pass code - Tick the 'Sometimes I need a little more help' option in 'All About Me' and enter the pass code.
* Product tour - the first time the app is used you get a quick walk-through of how to use it. Repeat the tour from the 'Take the Tour' button on the Personalization forrm.


## 1.7
* Added layers for 'shop' and 'enjoy'
* Added get around layer (ramps, steps, crossings, lifts, escalators)
* Added shop mobility to the 'around' layer
* increased size of top left icons


## 1.6
* Scripted import from OSM (still on demand, but single button to refresh the data) 
* Added Changing Places data and approved logo
* updated favicon + app icons to new design
* Tweaks to layout
* fix: user settings not refreshed after saving.
* Marker feature change to modal box and made larger
* Layer buttons only shown if layer contains data (the other layers will return shortly!)
* refactoring of code around popups and layer loading - popup now take whole screen and much large text

## 1.5
* Link to open street map editor fixed
* Improved popup information
* changed icon for parking meter
* Added Clare School Logo
* Formatted Layer selector
* added feature search
* groupped buttons into top left (on screen controls temp. removed)

## 1.4
* Settings for wheelchair and limited mobility changed to switch buttons. Reworked filter functions to account
* improved saving of personalisation settings to localstorage
* collated defaults into one place
* changed map bounds and max/min zoom to suite
* added edge buffering for smoother map
* improved peformance of layer loading to <1s
* popup - defaults to supplied by OSM with link to edit the feature in OSM.

## 1.3
* Improvements to toilet layer, start of common method for massarging OSM data into a more consistent form.
* Impoved popup display for toilets amenity layer.
* Personalisation iteration 1. layers can filter data based on wheelchair via icon bottom right
* Added EAT layer
* Active layers are saved to localStorage and recalled next session
* Opening_hours parsing for current status in place but needs more work.


## 1.2
* Map position and zoom saved for next time
* Updated the title to 'The Clare School Map'
* Toilets are always rendered as markers, even when in buildings
* Improved feature descriptions - click markers on the toilets layer. (much more to do here!)
* Added one of the Changes Places (Castle Mall) to OSM
* Added the pedestrian area outside The Forum, and various other fixes to OSM


## 1.1
* Improved toilet data to include toilets in buildings (when listed in OSM)
* Added Full Screen button
* Added Geolocate (you are here) button 
* Added button for personalisation (non-functional)
* Added basic routing control - very basic as yet
* Icons - a little icon will appear in the top of the browser and if you add it to your home page on an iPad/andoid.

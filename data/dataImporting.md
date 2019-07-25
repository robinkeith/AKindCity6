
#Converting shape files
Shape files are a bundle of files consisting of at least a .dbf file and various combintations of .cpg .prj .sbn .sbx .shp .shp.xml .shx

Online tool for convertion: http://gipong.github.io/shp2geojson.js/
Uses the default coordinate set ()



# Extracting data from OpenStreetMap 

Extact using [TurboOverpass](https://overpass-turbo.eu/ )

Look up tags useage: [TagInfo](https://taginfo.openstreetmap.org/tags)

Find out more information on tags: [OSM Wiki](https://wiki.openstreetmap.org/wiki/Category:Tag_descriptions)

## Parent Referencing
This query looks up the name of the road a crossing is on.
`````
[bbox:52.578228,1.171761,52.693864,1.525726]
//[bbox:52.62,1.2,52.64,1.4]
[out:json]
//[out:csv(::id, ::lat, ::lon, road_name, road_speed)]
[timeout:600];


node["highway"="crossing"];
//node(id:388706237,355519497,340919676);

foreach {

  way(bn)["name"]-> .ways;
  //for .ways -> .way(t["name"]) {
    convert result
             ::id   = id(),
             ::geom = center(geom()),
             road_name    = ways.set(t["name"] ),
             road_speed = ways.set(t["maxspeed"]),
             ::     = ::;
   // out;// geom;
  //}
  out geom;
}
`````


# Extraction queries used

## 
* Bounding Box covering Norwich City and suburbs. See it here: http://bboxfinder.com/#52.578228,1.171761,52.693864,1.525726
* Timeout of 25 seconds
* Output to Overpass json (NOT geoJson and needs to be converted)

`````
[bbox:1.171761,52.578228,1.525726,52.693864]
//52.5986631853,1.2371951024,52.6793324876,1.373425588
[out:json][timeout:25]
`````

Note. In the following queries, the filter **nwr** is used instead of joining seperate node, way and relation filters.
The global bounding box is assumed, rather than using a bbox on each query clause.

The queries used are listed in /back-end/norwich.js


## Public Transport (public.geojson)
````
nwr[railway=station];
>>bus stations
````
## TOILETS Layer
Toilets can be recorded as seperate amenities: 
 amenity=toilets, amenity=toilet, amenity=toilet_private

Or as tags of another feature, typically a building, in which case one or more toilet(.*) tags will be used.

###  Toilets as amenities
`````
  nwr[~"^toilet(s):.*$"~"."];
`````
###  Toilets as tags of another feature
`````
  nwr["amenity"~"toilet.*$"];
`````
## EAT/DRINK Layer

## SHOP Layer
````

````



## HELP Layer
````
nwr[amentiy=police];
>>walk-in centers
>>pharmacists
>> vets
````


---------------------------------

`````
 // query part for: “wheelchair=*”
  node["wheelchair"]({{bbox}});
  way["wheelchair"]({{bbox}});
  relation["wheelchair"]({{bbox}});
  `````

  ## Experiment
  [bbox:52.6213114049,1.2994429312,52.6242253769,1.3039059933]// 2 parking meters
//[bbox:52.578228,1.171761,52.693864,1.525726] // large area
[out:json]
[timeout:300];


node[amenity=vending_machine][vending=parking_tickets]->.machines;
foreach.machines->.machine(
  
  (
  	make node test="spam";
  	.machine;
  );
  out;  
);


## MapFeature specification
MapFeature is the class used for rendering of features on the map

Fields:
* Name
* Location
* Directions
* Description
* Filters

* Time 
Which layer is the feature in?  
Does the feature get displayed?

What maker is used?

what is displayed in the hover?

What's displayed in the info box?
static and dynamic elements

Class MapFeature(){
  layers[]
  baseMarker - marker class which defines the marker shape/svg, marker colour, icon, icon colour.
  markerModifier - name of function which can be used to modify the marker (e.g. )
  visibilityFilter - name of the function to use when deciding if the marker should be displayed
  allowPopup - true 

  caption
}
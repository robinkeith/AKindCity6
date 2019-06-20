# OpenStreetMap extacted data

Extact using [TurboOverpass](https://overpass-turbo.eu/ )

Look up tags useage: [TagInfo](https://taginfo.openstreetmap.org/tags)

Find out more information on tags: [OSM Wiki](https://wiki.openstreetmap.org/wiki/Category:Tag_descriptions)

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
nwr[~"^toilets:.*$"~"."];

### Parking
`````
 node["amenity"="parking"]({{bbox}});
 way["amenity"="parking"]({{bbox}});
 relation["amenity"="parking"]({{bbox}});
`````
### Toilets
Toilets can be recorded as seperate amenities:
* amenity=toilets, amenity=toilet, amenity=toilet_private
Or with a building in which case one or more toilet(.*) tags will be used.


`````
  //Toilets inside places
  nwr[~"^toilet(s):.*$"~"."];
  //Toilets as standalone amenities
  nwr["amenity"~"toilet.*$"];
 
  //15/6/19 returns 232 nodes, 28 ways, 0 rels

`````

`````
node["amenity"="toilets"]({{bbox}});
way["amenity"="toilets"]({{bbox}});
relation["amenity"="toilets"]({{bbox}});

node["toilets"]({{bbox}});
way["toilets"]({{bbox}});
relation["toilets"]({{bbox}});

node["toilets:wheelchair"]({{bbox}});
way["toilets:wheelchair"]({{bbox}});
relation["toilets:wheelchair"]({{bbox}});
`````


`````
 // query part for: “wheelchair=*”
  node["wheelchair"]({{bbox}});
  way["wheelchair"]({{bbox}});
  relation["wheelchair"]({{bbox}});
  `````
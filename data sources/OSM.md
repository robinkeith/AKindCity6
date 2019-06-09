# OpenStreetMap extacted data

Extact using [TurboOverpass](https://overpass-turbo.eu/ )

Look up tags useage: [TagInfo](https://taginfo.openstreetmap.org/tags)

Find out more information on tags: [OSM Wiki](https://wiki.openstreetmap.org/wiki/Category:Tag_descriptions)

## Extraction queries used
### Parking
`````
 node["amenity"="parking"]({{bbox}});
 way["amenity"="parking"]({{bbox}});
 relation["amenity"="parking"]({{bbox}});
`````

`````
 node["amenity"="parking_space"]({{bbox}});
  way["amenity"="parking_space"]({{bbox}});
  relation["amenity"="parking_space"]({{bbox}});
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
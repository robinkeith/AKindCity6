
module.exports = [
  // [bbox:1.171761,52.578228,1.525726,52.693864]

  // Get Here layer
  { name: 'here-parkingSpaces', layers: ['here'], query: 'nwr[amenity=parking];' },
  { name: 'here-parkingMeters', layers: ['here'], query: 'nwr[amenity=vending_machine][vending=parking_tickets];' },
  { name: 'here-taxi', layers: ['here'], query: 'nwr[amenity=taxi];' },
  /* Add
        nwr[railway=station];
        >>bus stations
    */

  // Get around layer - shop mobility, bus routes?
  { name: 'around-aids', layers: ['around'], query: `
    nwr[highway=lift];
    nwr[building][elevator=yes];
    nwr[ramp];
    nwr[conveying];
    ` },
  { name: 'around-barrier', layers: ['around'], query: `
    nwr[highway=steps];
    nwr[highway=footway][incline];
    ` },

  { name: 'around-crossings', layers: ['around'], query: `
    node["highway"="crossing"]["crossing"!="uncontrolled"];
    foreach {
      way(bn)["name"]-> .ways;
      convert result
          ::id   = id(),
          ::geom = center(geom()),
          road_name    = ways.set(t["name"] ),
          road_speed = ways.set(t["maxspeed"]),
          :: = ::;
    out geom;
    }
    ` },
  { name: 'around-signals', layers: ['around'], query: `
    (node["highway"="traffic_signals"];);
    foreach {
      way(bn)["name"]-> .ways;
      convert result
          ::id   = id(),
          ::geom = center(geom()),
          road_name    = ways.set(t["name"] ),
          road_speed = ways.set(t["maxspeed"]),
          ::     = ::;
    out geom;
    }
    ` },

  { name: 'around-amenities', layers: ['around'], query: `nwr[shop=mobility];` },

  /* The followinf might also be useful, but not currently used in area
    amenity=charging station    amenity=dog bin
    amenity=dog waste bin       amenity=luggage_locker
    */

  // toilets
  // Toilets can be recorded as seperate amenities:
  { name: 'toilets-amenity', layers: ['toilets'], query: 'nwr[amenity=toilets];' },
  { name: 'toilets-nonAmenity', layers: ['toilets'], query: 'nwr[~"^toilet(s):.*$"~"."];' },

  // Eat/drink
  { name: 'food-bar', layers: ['food'], query: 'nwr[amenity=bar];' },
  { name: 'food-cafe', layers: ['food'], query: 'nwr[amenity=cafe];' },
  { name: 'food-fast_food', layers: ['food'], query: 'nwr[amenity="fast_food"];' },
  { name: 'food-pubs', layers: ['food'], query: 'nwr[amenity=pub];' },
  { name: 'food-resturants', layers: ['food'], query: 'nwr[amenity=restaurant];' },
  /* Possible additions:
        amenity=food court      amenity=ice cream
    */

  // shop
  { name: 'shop', layers: ['shop'], query: 'nwr[shop];nwr[amenity=marketplace];' },

  // learn
  { name: 'learn', layers: ['learn'], query: 'nwr[amenity=library];' },

  // enjoy
  { name: 'enjoy', layers: ['enjoy'], query: `
        nwr[amenity="arts centre"];
        nwr[amenity="cinema"];
        nwr[amenity="community center"];
        nwr[amenity="community centre"];
        nwr[amenity="concert hall"];
        nwr[amenity="events venue"];
        nwr[amenity="exhibition centre"];
        nwr[amenity="music venue"];
        nwr[amenity="nightclub"];
        nwr[amenity="park"];
        nwr[leisure][access!=private][leisure!=fountain];
        nwr[sport];`
  },

  // help
  // {name: 'helpSafePlaces', query:'nwr[amenity=]'},
  { name: 'help-services', layers: ['help'], query: 'nwr[amenity=police];nwr[name~"Walk-in"];' }
  // {name: 'help-info', query:'nwr[amenity=]'},
  /* possible additiona:
    //amenity=emergency phone
    //amenity=pharmacy
    */
]

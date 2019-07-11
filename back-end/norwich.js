
module.exports = [
  // [bbox:1.171761,52.578228,1.525726,52.693864]

  // Get Here layer
  { name: 'here-parkingSpaces', query: 'nwr[amenity=parking];' },
  { name: 'here-parkingMeters', query: 'nwr[amenity=vending_machine][vending=parking_tickets];' },
  { name: 'here-taxi', query: 'nwr[amenity=taxi];' },
  /* Add
        nwr[railway=station];
        >>bus stations
    */

  // Get around layer - shop mobility, bus routes?
  { name: 'around', query: `
        nwr[highway=lift];
        nwr[highway=steps];
        nwr[highway=crossing][crossing!=uncontrolled];
        nwr[highway=traffic_signals];
        nwr[highway=footway][incline];
        nwr[building][elevator=yes];
        nwr[wheelchair=designated];
        nwr[ramp];
        nwr[conveying];
        nwr[tactile_paving];
        ` },
  { name: 'around-amenities', query: `nwr[shop=mobility];` },

  /* The followinf might also be useful, but not currently used in area
    amenity=charging station    amenity=dog bin
    amenity=dog waste bin       amenity=luggage_locker
    */

  // toilets
  // Toilets can be recorded as seperate amenities:
  { name: 'toilets-amenity', query: 'nwr[amenity=toilets];' },
  { name: 'toilets-nonAmenity', query: 'nwr[~"^toilet(s):.*$"~"."];' },

  // Eat/drink
  { name: 'food-bar', query: 'nwr[amenity=bar];' },
  { name: 'food-cafe', query: 'nwr[amenity=cafe];' },
  { name: 'food-fast_food', query: 'nwr[amenity="fast_food"];' },
  { name: 'food-pubs', query: 'nwr[amenity=pub];' },
  { name: 'food-resturants', query: 'nwr[amenity=restaurant];' },
  /* Possible additions:
        amenity=food court      amenity=ice cream
    */

  // shop
  { name: 'shop', query: 'nwr[shop];nwr[amenity=marketplace' },

  // learn
  { name: '', query: 'nwr[amenity=library]' },

  // enjoy
  { name: 'enjoy', query: `
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
  { name: 'help-services', query: 'nwr[amenity=police];nwr[name~"Walk-in"];' }
  // {name: 'help-info', query:'nwr[amenity=]'},
  /* possible additiona:
    //amenity=emergency phone
    //amenity=pharmacy
    */
]

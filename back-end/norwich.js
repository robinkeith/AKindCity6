
module.exports = [
    //Get Here layer
/*    {name: 'parkingSpaces', query:'nwr[amenity=parking];'},
    {name: 'parkingMeters', query:'nwr[amenity=vending_machine][vending=parking_tickets];'},
    {name: 'taxi', query:'nwr[amenity=taxi];'},
*//*
    //Get around layer - shop mobility, bus routes?
   
    //{name: '', query:'nwr[amenity=]'},
    //{name: '', query:'nwr[amenity=]'},
    amenity=charging station
    amenity=dog bin
    amenity=dog waste bin
    amenity=luggage_locker
    */
 /*  {name: 'around', query:`
        nwr[highway=lift];
        nwr[highway=steps];
        nwr[ highway=crossing][crossing!=uncontrolled];
        nwr[ highway=traffic_signals];
        nwr[highway=footway][incline];
        nwr[building][elevator=yes];
        nwr[wheelchair=designated];
        nwr[ramp];
        nwr[conveying];
        nwr[tactile_paving];
        `},*/
    {name:'around-amenities', query:`nwr[shop=mobility];`},

  /* 
    //toilets
    {name: 'toiletsAmenity', query:'nwr[amenity=toilets];'},
    {name: 'toiletsNonAmenity', query:'nwr[~"^toilet(s):.*$"~"."];'},
  */  
 /*
    //Eat/drink
    {name: 'food-bar', query:'nwr[amenity=bar];'},
    {name: 'food-cafe', query:'nwr[amenity=cafe];'},
    {name: 'food-fast_food', query:'nwr[amenity="fast_food"];'},
    {name: 'food-pubs', query:'nwr[amenity=pub];'},
    {name: 'food-resturants', query:'nwr[amenity=restaurant];'},
    amenity=food court
    amenity=ice cream
*/
/* 
    //shop
    {name: 'shop', query:'nwr[shop];'},
    //{name: '', query:'nwr[amenity=]'},
  */  
    //learn
    //amenity=library
/*    
    //enjoy
    {name: 'enjoy', query:`
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
        nwr[leisure][access!=private];
        nwr[sport];
        `
    },
*/
    //help
    //{name: 'helpSafePlaces', query:'nwr[amenity=]'},
    //{name: 'help-services', query:'nwr[amenity=police];nwr[name~"Walk-in"];'},
    //{name: 'helpInfo', query:'nwr[amenity=]'},
    //{name: '', query:'nwr[amenity=]'},

    //amenity=emergency phone
    //amenity=pharmacy
];

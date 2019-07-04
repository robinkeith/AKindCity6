
module.exports = [
    //Get Here layer
/*    {name: 'parkingSpaces', query:'nwr[amenity=parking];'},
    {name: 'parkingMeters', query:'nwr[amenity=vending_machine][vending=parking_tickets];'},
    {name: 'taxi', query:'nwr[amenity=taxi];'},
*//*
    //Get around layer - shop mobility, bus routes?
    //{name: '', query:'nwr[amenity=]'},
    //{name: '', query:'nwr[amenity=]'},
*/  /* 
    //toilets
    {name: 'toiletsAmenity', query:'nwr[amenity=toilets];'},
    {name: 'toiletsNonAmenity', query:'nwr[~"^toilet(s):.*$"~"."];'},
  */  
    //Eat/drink
    {name: 'food-bar', query:'nwr[amenity=bar];'},
    {name: 'food-cafe', query:'nwr[amenity=cafe];'},
    {name: 'food-fast_food', query:'nwr[amenity="fast_food"];'},
    {name: 'food-pubs', query:'nwr[amenity=pub];'},
    {name: 'food-resturants', query:'nwr[amenity=restaurant];'},

    //shop
    //{name: '', query:'nwr[amenity=]'},
    //{name: '', query:'nwr[amenity=]'},
    
    //learn
    //enjoy

    //help
    //{name: 'helpSafePlaces', query:'nwr[amenity=]'},
    {name: 'help-services', query:'nwr[amenity=police];nwr[name~"Walk-in"];'},
    //{name: 'helpMedical', query:'nwr[amenity=]'},
    //{name: 'helpInfo', query:'nwr[amenity=]'},
    //{name: '', query:'nwr[amenity=]'},

];

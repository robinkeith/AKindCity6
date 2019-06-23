export var userSettings = {
    name:"",
    simpleMode:false,
    pictureMode:false,
    mobility:"full", //["full","wheelchair","limited","power"],
    radarKey:false,
    dementia:false,
    assistanceDog:false,
    hoistRequired:false,
    demoMode:false,

    isVisible: function(properties){
        return (this.mobility==="wheelchair" && properties.wheelchair==="yes");
    },

    restore: function(){
      //TODO  restore userSettings
    },

    /*Save user settings to local storage */
    save: function(){
        //TODO save userSettings
    },
} 


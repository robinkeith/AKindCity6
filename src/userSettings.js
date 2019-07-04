import $ from "jquery";
import store from 'store2';
window.$ = window.jQuery = $

const SETTINGS_KEY="userSettings"

export class UserSettings{
    constructor(){
        //object asign used to copy properties fom a default object, then overwrite with an object from local settings (if there is one)
        Object.assign(this, 
            
            {
                userName:"",
                simpleMode:false,
                pictureMode:false,
                wheelchair:false,
                limitedMobility:false,
                radarKey:false,
                dementia:false,
                assistanceDog:false,
                hoistRequired:false,
                demoMode:false,
            },
            JSON.parse( store.get(SETTINGS_KEY))
        );
    }

    isVisible(properties){
        return (this.wheelchair && properties.wheelchair==="yes");
    }

    /*Save user settings to local storage */
    save(){
        //TODO save userSettings
        store.set(SETTINGS_KEY,JSON.stringify( this));
    }

    initUserSettingsForm(){
        $("#userName").val(this.userName);
        $('#switchSimple').prop("checked" ,this.simpleMode);
        $('#switchPics').prop("checked", this.pictureMode);
        $('#switchWheelchair').prop("checked", this.wheelchair);
        $('#switchLimitedMobility').prop("checked", this.limitedMobility);
        $('#switchRADAR').prop("checked", this.radarKey);
        $('#switchDementia').prop("checked", this.dementia);
        $('#switchDog').prop("checked", this.assistanceDog);
        $('#switchHoist').prop("checked", this.hoistRequired);
        $('#switchDemo').prop("checked", this.demoMode);
    }

    //Add an event handler to the settings form submit button to store the values and close the form 
    setupSettingsFormSubmit(){

        let userSettings=this;
        $('#settings-form').on('submit', function (event) {
            event.preventDefault();
            userSettings.userName=$("#userName").val();
            userSettings.simpleMode=$('#switchSimple').prop("checked" );
            userSettings.pictureMode=$('#switchPics').prop("checked");
            userSettings.wheelchair=$('#switchWheelchair').prop("checked");
            userSettings.limitedMobility=$('#switchLimitedMobility').prop("checked");
            userSettings.radarKey=$('#switchRADAR').prop("checked");
            userSettings.dementia=$('#switchDementia').prop("checked");
            userSettings.assistanceDog=$('#switchDog').prop("checked");
            userSettings.hoistRequired=$('#switchHoist').prop("checked");
            userSettings.demoMode=$('#switchDemo').prop("checked");
            userSettings.save();
            $('#personalSettings').modal('hide');
            
        });
    }
}
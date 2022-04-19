import {defineComponent} from "vue";

import OSMService from "./osm.service.js";
import LocationsService from "./locations.service.js";
import WsSocketService from "./ws-socket.service.js";

export const LocationsComponent = defineComponent({
    data(){
        return {
            title: "SHADOW HIJACKERS GANG LOCATIONS TRACKER",
            logsData: "",
            osmService: new OSMService(),
            locationService: new LocationsService(),
            wsService: new WsSocketService()
        }
    },
    mounted(){
       this.setupUser();
       this.initMap();
       this.wsSocketListener();
    },
    methods: {
        initMap(){
            this.osmService.initMap();
        },
        wsSocketListener(){
            this.wsService.onOpen = (()=>{
                this.title = this.title.split(":")[0] + ":  HEYYYYY CONNECTED";
                this.sendLocOnChange();
            });
            this.wsService.closeHandler = ()=>{
                this.title = this.title.split(":")[0] + ": OMG DISCONNECTED";
            };
            this.wsService.onReconnect = ()=>{
                this.title = this.title.split(":")[0] + ": RECONNECTING...";
            }
            this.wsService.onMessage = (ev)=>{
                const gangLocationsStr = ev.data;
                console.log("recived locations", gangLocationsStr);
                this.osmService.clearMarkers();
                const gangLocations = JSON.parse(gangLocationsStr)
                Object.entries(gangLocations).forEach(([userId, latlng])=>{
                    this.osmService.setMarker(latlng, userId);
                })
                this.writeLogsOnview(gangLocations);
            }
            this.wsService.connect();
        },
        sendLocOnChange(){
            this.locationService.onSuccess = (latlng)=>{
                this.wsService.send({ userId: this.userId, latlng: latlng})
            }
            // for first call
            this.locationService.getCurrentPosition();

            // for every 10s get the locations whether user changed or not
            this.locationService.watchPosition();
        },
        setupUser(){
            if (localStorage.getItem("userId")){
                this.userId = localStorage.getItem("userId")
            }else{
                this.userId = Math.floor(Math.random()* 100000 + new Date().getTime()).toString()
                localStorage.setItem("userId", this.userId);
            }
        },
        writeLogsOnview(gangLocations){
            this.logsData = "";
            Object.entries(gangLocations).forEach(([userId, latlng])=>{
                this.logsData += `<li><strong>${userId}</strong>:<address>LAT ${latlng.lat}, LNG: ${latlng.lng}</address>`
            })
        }
    },
    template: document.getElementById("locations")?.innerHTML ?? ''
})

export default {
    LocationsComponent
}
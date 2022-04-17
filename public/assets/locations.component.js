import {defineComponent} from "vue";

import OSMService from "./osm.service.js";
import LocationsService from "./locations.service.js";
import WsSocketService from "./ws-socket.service.js";

export const LocationsComponent = defineComponent({
    data(){
        return {
            title: "SHADOW HIJACKERS GANG LOCATIONS TRACKER",
            osmService: new OSMService(),
            locationService: new LocationsService(),
            wsService: new WsSocketService()
        }
    },
    mounted(){
       this.setupUser();
       this.initMap();
       this.wsService.connect();
       this.wsService.onOpen(()=>{
           this.title += ': HEYYYYY CONNECTED'
           this.sendLocOnChange();
       });
       this.gangLocationsListener();
    },
    methods: {
        initMap(){
            this.osmService.initMap();
        },
        gangLocationsListener(){
            this.wsService.onMessage((ev)=>{
                const gangLocationsStr = ev.data;
                console.log("recived locations", gangLocationsStr);
                this.osmService.clearMarkers();
                const gangLocations = JSON.parse(gangLocationsStr)
                Object.entries(gangLocations).forEach(([userId, latlng])=>{
                    this.osmService.setMarker(latlng, userId);
                })
            })
        },
        sendLocOnChange(){
            this.locationService.onSuccess = (latlng)=>{
                this.wsService.send({ userId: this.userId, latlng: latlng})
            }
            this.locationService.watchPosition();
        },
        setupUser(){
            if (localStorage.getItem("userId")){
                this.userId = localStorage.getItem("userId")
            }else{
                this.userId = Math.floor(Math.random()* 100000 + new Date().getTime()).toString()
                localStorage.setItem("userId", this.userId);
            }
        }
    },
    template: document.getElementById("locations")?.innerHTML ?? ''
})

export default {
    LocationsComponent
}
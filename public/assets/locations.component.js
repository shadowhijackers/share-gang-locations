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
                const latlng = ev.data;
                console.log("recived locations", latlng);
                this.osmService.clearMarkers();
                this.osmService.setMarker(JSON.parse(latlng));
            })
        },
        sendLocOnChange(){
            this.locationService.onSuccess = (latlng)=>{
                // alert(JSON.stringify(latlng))
                this.wsService.send(latlng)
            }
            this.locationService.watchPosition();
        }
    },
    template: document.getElementById("locations")?.innerHTML ?? ''
})

export default {
    LocationsComponent
}
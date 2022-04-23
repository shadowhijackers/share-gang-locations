import html from './html.js';

import OSMService from "./osm.service.js";
import LocationsService from "./locations.service.js";
import WsSocketService from "./ws-socket.service.js";

export default {
    name: "LocaitonsComponent",
    data(){
        return {
            title: "GANG LOCATIONS TRACKER",
            wsStatus: "",
            logsData: "",
            osmService: new OSMService(),
            locationService: new LocationsService(),
            wsService: new WsSocketService(),
            gangLocations: {}
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
                this.wsStatus = "CONNECTED";
                this.sendLocOnChange();
            });
            this.wsService.closeHandler = ()=>{
                this.wsStatus = "DISCONNECTED";
            };
            this.wsService.onReconnect = ()=>{
                this.wsStatus = "RECONNECTING";
            }
            this.wsService.onMessage = (ev)=>{
                this.wsStatus = "CONNECTED";
                const gangLocationsStr = ev.data;
                console.log("recived locations", gangLocationsStr);
                const gangLocations = JSON.parse(gangLocationsStr)
                this.osmService.clearMarkers();
                // Object.entries(gangLocations).forEach(([userId, latlng])=>{
                //     this.osmService.setMarker(latlng, userId);
                // })
                this.osmService.setMarkers(gangLocations);
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
            this.gangLocations = gangLocations;
        }
    },
    render() {
        return html`
        <div>
          <h2>${this.title}</h2>
          <h4>CONNECTION STATUS:  <b>${this.wsStatus}</b></h4>
          <div id="mapid" style="width: 98%; height: 400px;margin: 0 auto;"></div>
          <h3>Gang Info</h3>
          <ul> ${
            Object.entries(this.gangLocations).map(([userId, latlng])=>{
                return html`<li><strong>${userId} ${ this.userId == userId? "(YOU)":""}</strong>:<address>LAT ${latlng.lat}, LNG: ${latlng.lng}</address>`
            })
          }</ul>
        </div>
        `
    },
}
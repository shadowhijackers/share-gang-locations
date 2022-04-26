import html from '../html.js';

import OSMService from "../services/osm.service.js";
import LocationsService from "../services/locations.service.js";
import WsSocketService from "../services/ws-socket.service.js";

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
        },
        shareTrackerLink(){
            const URL = location.href;
            window.open(URL, "_blank");
        }
    },
    render() {
        return html`
      <main class="container c-locations">
        <header class="app-header primary-bg">
           <h2 class="app-header__title">SHARE GANG LOCATIONS</h2>
           <h5 class="app-header__sub-title">© SHADOW HIJACKERS</h5> 
        </header>
        
        <section class="c-locations__map-container">
          <div id="mapid"></div>
        </section>

        <footer class="app-footer">
          <button onClick=${()=>{this.shareTrackerLink()}} class="app-footer__btn">SHARE TRACKER LINK</button>
        </footer>

        <div style="display: none">
          <ul> 
           ${
              Object.entries(this.gangLocations).map(([userId, latlng])=>{
                return html`<li><strong>${userId} ${ this.userId == userId? "(YOU)":""}</strong>:<address>LAT ${latlng.lat}, LNG: ${latlng.lng}</address></li>`
              })
            }
          </ul>
        </div>  
      </main>
        `
    },
}
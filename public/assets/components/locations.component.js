import html from '../html.js';

import OSMService from "../services/osm.service.js";
import LocationsService from "../services/locations.service.js";
import WsSocketService from "../services/ws-socket.service.js";
import AlertService from '../services/alert.service.js';

export default {
    name: "LocaitonsComponent",
    data(){
        return {
            title: "GANG LOCATIONS TRACKER",
            wsStatus: "",
            logsData: "",
            uniqueId: "",
            gangLocations: {},
            showGangInfo: false,
            osmService: new OSMService(),
            locationService: new LocationsService(),
            wsService: new WsSocketService(),
            alertService: new AlertService()
        }
    },
    mounted(){
       this.setupUser();
       this.initMap();
       this.wsSocketListener();
       this.uniqueId = location.href.split("/")[location.href.split("/").length-2]
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
                this.userId = Math.floor(Math.random()* 100000 + new Date().getTime()).toString(16)
                localStorage.setItem("userId", this.userId);
            }
        },
        writeLogsOnview(gangLocations){
            this.logsData = "";
            this.gangLocations = gangLocations;
        },
        shareTrackerLink(){
            const URL = `${location.origin}/gangs/${this.uniqueId}/locations`;
            navigator.clipboard.writeText(URL).then(()=>{
                this.alertService.show("Copied link");
            }).catch(()=>{
                this.alertService.show("Something went wrong! copy URL from browser");
            });
        },
        fitBoundGangInMap(){
            this.showGangInfo = true;
            this.osmService.fitBounds();
        }
    },
    render() {
        return html`
      <main class="c-locations">
        <header class="app-header primary-bg">
           <h2 class="app-header__title">SHARE GANG LOCATIONS</h2>
           <h4 class="app-header__sub-title">© SHADOW HIJACKERS</h4> 
        </header>
        
        <section class="c-locations__map-container">
          <div class="c-locations__locate-people" onClick=${()=>{this.fitBoundGangInMap()}}>
            <span class="material-icons">not_listed_location</span>          
          </div>
          <div id="mapid"></div>
        </section>

        <footer class="app-footer">
          <button onClick=${()=>{this.shareTrackerLink()}} class="app-footer__btn">
          <span class="material-icons md-18">share</span>
            <span>SHARE TRACKER LINK</span>
          </button>
        </footer>

        <div style="display: ${this.showGangInfo? 'block': 'none'}" class="c-locations__gang-info txt-color">
          <div class="flex flex-space-between flex-align-center">
            <h3>GANG INFO</h3>
            <div><span onClick=${()=>{this.showGangInfo = false}} class="material-icons">highlight_off</span></div>
          </div>
          <ul> 
           ${
              Object.entries(this.gangLocations).map(([userId, latlng])=>{
                return html`<li><h3>${userId} ${ this.userId == userId? "(YOU)":""}</h3><address>LAT ${latlng.lat}, LNG: ${latlng.lng}</address></li>`
              })
            }
          </ul>
        </div>  
      </main>
        `
    },
}
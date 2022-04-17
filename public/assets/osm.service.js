export default class OSMService {
    constructor(){
        this.mapIns = null;
        this.marker =  null;
        this.mapPopup = null;
        this.MAP = {
            API: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
            CONFIG: {
                maxZoom: 11,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1
            }
        }
    }
    initMap(){
        this.mapIns= L.map('mapid').setView([13.0685, 80.2484], 13); // default view to chennai
        L.tileLayer(this.MAP.API, this.MAP.CONFIG).addTo(this.mapIns);
        this.mapPopup = L.popup();
        this.setMarker({lat: 13.0685 , lng: 80.2484})
        
    }
    setMarker(latlng, userId){
        this.marker = L.marker([+latlng.lat, +latlng.lng]).addTo(this.mapIns)
        .bindPopup(userId).openPopup();
    }
    clearMarkers(){
        if (!!this.marker){
            this.mapIns.removeLayer(this.marker);
        }
    }
}

export default class OSMService {
    constructor(){
        this.mapIns = null;
        this.marker =  null;
        this.mapPopup = null;
        this.markers = [];
        this.MAP = {
            API: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
            CONFIG: {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                zoomAnimation: false,
                markerZoomAnimation: false
            }
        }
    }
    initMap(){
        this.mapIns= L.map('mapid').setView([13.0685, 80.2484], 13); // default view to chennai
        L.tileLayer(this.MAP.API, this.MAP.CONFIG).addTo(this.mapIns);
        this.mapPopup = L.popup();        
    }
    
    setMarker(latlng, userId){
        this.marker = L.marker([+latlng.lat, +latlng.lng], {draggable:false, markerZoomAnimation: false, autoPanOnFocus	: false})
        var featureGroup = L.featureGroup([this.marker])
        .addTo(this.mapIns)
        .bindPopup(userId).openPopup();
        this.mapIns.fitBounds(featureGroup.getBounds())
    }

    setMarkers(gangLocations){
      this.mapIns.removeLayer(this.markers);
      Object.entries(gangLocations).forEach(([userId, latlng])=>{
        const marker = L.marker([+latlng.lat, +latlng.lng])
        .addTo(this.mapIns)
        .bindPopup(userId).openPopup();
        this.markers.push(marker);
      });
      var featureGroup = L.featureGroup(this.markers).addTo(this.mapIns)
      this.mapIns.fitBounds(featureGroup.getBounds())
    }

    clearMarkers(){
        if (!!this.marker){
            this.mapIns.removeLayer(this.marker);
        }

        if (Array.isArray(this.markers)){
            this.markers.forEach(m=>{
                this.mapIns.removeLayer(m);
            })
        }

        this.markers = [];
    }
}

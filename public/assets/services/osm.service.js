export default class OSMService {
    constructor(){
        this.mapIns = null;
        this.marker =  null;
        this.mapPopup = null;
        this.markers = [];
        this.layerGroup = null;
        this.MAP = {
            API: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            CONFIG: {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                zoomAnimation: true,
                fadeAnimation:true,
                markerZoomAnimation:true,
                sleep: true,
                sleepTime: 750,
            }
        }
    }
    initMap(){
        this.mapIns= L.map('mapid').setView([13.0685, 80.2484], 5); // default view to chennai
        L.tileLayer(this.MAP.API, this.MAP.CONFIG).addTo(this.mapIns);
        this.mapPopup = L.popup();        
    }
    
    setMarker(latlng, userId){
        this.marker = L.marker([+latlng.lat, +latlng.lng], {draggable:false, markerZoomAnimation: false, autoPanOnFocus	: false})
        var featureGroup = L.featureGroup([this.marker])
        .addTo(this.mapIns)
        .bindPopup(userId,  {autoPan: false, autoClose: false}).openPopup();
        this.mapIns.fitBounds(featureGroup.getBounds())
    }

    setMarkers(gangLocations){
      this.mapIns.removeLayer(this.markers);
      Object.entries(gangLocations).forEach(([userId, latlng])=>{
        const marker = L.marker([+latlng.lat, +latlng.lng])
        .addTo(this.mapIns)
        .bindPopup(userId, {autoPan: false, autoClose: false}).openPopup();
        this.markers.push(marker);
      });
      this.layerGroup = L.layerGroup(this.markers).addTo(this.mapIns)
    //   this.mapIns.fitBounds(featureGroup.getBounds())
    }

    async fitBounds(){
        let featureGroup = L.featureGroup(this.markers).addTo(this.mapIns)
        this.mapIns.fitBounds(featureGroup.getBounds())
        // sleep for 5s
        await new Promise((res, rej)=>{
            setTimeout(()=>{res(true)}, 5000)
        })
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

        if(this.layerGroup?.getLayers?.()?.length > 0){
            this.layerGroup.clearLayers();
        }

        this.markers = [];
    }
}

export default class LocationsService {
  constructor() {
    this.watcherId = '';
    this.locationsWorker = new Worker('/assets/locations-worker.js');
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
    }
  }

  onSuccess = (latlng) => {

  }

  _successCallBack = (position) => {
    this.onSuccess(this.buildLatLng(position))
  }

  _errorCallBack = (err) => { }

  getCurrentPosition() {
    return navigator.geolocation.getCurrentPosition(this._successCallBack, this._errorCallBack, { enableHighAccuracy: true, maximumAge: 10000 })
  }

  watchPosition() {
    this.locationsWorker.onmessage = (canTrigger) => {
      navigator.geolocation.getCurrentPosition(this._successCallBack,
        this._errorCallBack,
        { enableHighAccuracy: true, maximumAge: 10000 }
      )
    }
  }

  buildLatLng(pos) {
    var crd = pos.coords;
    return { lat: crd.latitude, lng: crd.longitude }
  }
}
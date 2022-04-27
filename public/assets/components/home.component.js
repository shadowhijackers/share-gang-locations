import html from '../html.js';
import OSMService from '../services/osm.service.js';

export default {
  name: "HomeComponent",
  data(){
    return {
      osmService: new OSMService(),
      uniqueId: (Math.floor(Math.random() * 10000000)).toString(16)
    }
  },
  mounted() {
    this.osmService.initMap();
  },
  methods: {
    shareTrackerLink(){
     const URL = `/gangs/${this.uniqueId}/locations`;
     navigator.clipboard.writeText(URL);

     alert("Copied link");
    }
  },
  render() {
    return html`
        <main class="container c-home">
          <header class="app-header primary-bg">
             <h2 class="app-header__title">SHARE GANG LOCATIONS</h2>
             <h4 class="app-header__sub-title">© SHADOW HIJACKERS</h4> 
          </header>
          
          <section class="c-home__map-container">
            <div id="mapid"></div>
          </section>

          <footer class="app-footer">
            <button onClick=${()=>{this.shareTrackerLink()}} class="app-footer__btn">            
            <i class="icon icon-share" />
            SHARE TRACKER LINK</button>
          </footer>
        </main>
    `;
  },
}
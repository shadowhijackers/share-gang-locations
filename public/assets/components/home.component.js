import html from '../html.js';
import OSMService from '../services/osm.service.js';

export default {
  name: "HomeComponent",
  data(){
    return {
      osmService: new OSMService(),
      uniqueId: (Math.floor(Math.random() * 10000000)).toString(16),
    }
  },
  mounted() {
    this.osmService.initMap();
  },
  methods: {
    shareTrackerLink(){
     const URL = `${location.origin}/gangs/${this.uniqueId}/locations`;
     location.href = URL
    }
  },
  render() {
    return html`
        <main class="c-home">
          <header class="app-header primary-bg">
             <h2 class="app-header__title">SHARE GANG LOCATIONS</h2>
             <h4 class="app-header__sub-title">© SHADOW HIJACKERS</h4> 
          </header>
          
          <section class="c-home__map-container">
            <div id="mapid"></div>
          </section>

          <footer class="app-footer">
            <button onClick=${()=>{this.shareTrackerLink()}} class="app-footer__btn">            
            <i class="icon icon-play" />
            <span>START SHARING</span></button>
          </footer>
        </main>
    `;
  },
}
import HomeComponent from "./home.component.js"
import LocaitonsComponent from "./locations.component.js"
import html from '../html.js';

export default {
  name: 'App',
  el: '#app',
  data() {

    return {
      count: 0,
      isLocationsPage: location.href.split("/")[location.href.split("/").length-1].includes("locations")
    };
  },
  render() {
    const PageComponent = this.isLocationsPage? LocaitonsComponent: HomeComponent;
    return html`
    <${PageComponent}></${PageComponent}>
    `
  },
}
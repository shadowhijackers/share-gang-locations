import HomeComponent from "./home.component.js"
import LocaitonsComponent from "./locations.component.js"
import html from './html.js';

export default {
  name: 'App',
  el: '#app',
  data() {
    return {
      count: 0,
    };
  },
  render() {
    return html`
    <${HomeComponent}></${HomeComponent}>
    <${LocaitonsComponent}></${LocaitonsComponent}>
    `
  },
}
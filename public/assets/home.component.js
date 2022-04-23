import html from './html.js';

export default {
  name: "HomeComponent",
  data(){
    return {
      test: "title",
      uniqueId: (Math.floor(Math.random() * 10000000)).toString(16)
    }
  },
  render() {
    return html`
        <h1>${this.test}</h1>
        <a href="/gangs/${this.uniqueId}/locations">Create Locations</a>
    `;
  },
}
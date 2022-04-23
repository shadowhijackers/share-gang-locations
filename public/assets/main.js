import App from './components/app.js'
import { createApp, h } from 'https://unpkg.com/vue@3.0.4/dist/vue.runtime.esm-browser.js';
const app = createApp({
  render: () => h(App),
});
app.mount(`#app`);


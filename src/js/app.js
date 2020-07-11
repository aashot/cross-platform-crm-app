// Import Vue
import Vue from 'vue';

// Import Framework7
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';

// Import Framework7-Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';

// Import Framework7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.scss';

// Import App Component
import App from '../components/app.vue';

import $ from 'jquery';

import Vue2TouchEvents from 'vue2-touch-events'

// Import Vue.js fuiters
import filters from '../filters/index.js';

Vue.use(filters);

Vue.use(Vue2TouchEvents);

Vue.prototype.$ = $;

//Import store from store.js
import store from '../store';

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);


// Init App


export default new Vue({
  el: '#app',
  store: store,
  render: (h) => h(App),

  // Register App Component
  components: {
    app: App
  },
});
import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';

axios.defaults.baseURL =
  process.env.VUE_APP_NODE_ENV === 'production'
    ? `${process.env.VUE_APP_HOSTNAME}/`
    : 'http://localhost:3000/';
axios.defaults.withCredentials = true;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');

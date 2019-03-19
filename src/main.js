import Vue from 'vue';
import './plugins/vuetify';
import VeeValidate from 'vee-validate';
import App from './App.vue';
import router from './router';
import store from './store';

import './registerServiceWorker';

Vue.use(VeeValidate);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

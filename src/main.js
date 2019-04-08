import Vue from 'vue';
import './plugins/vuetify';
import VeeValidate from 'vee-validate';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/components';

import './registerServiceWorker';

Vue.use(VeeValidate);
Vue.config.productionTip = false;

Vue.filter('roundUp', (value) => {
  const precision = 10 ** 2;
  return Math.ceil(value * precision) / precision;
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

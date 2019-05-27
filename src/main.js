import Vue from 'vue';
import './plugins/vuetify';
import VeeValidate, { Validator } from 'vee-validate';
import moment from 'vue-moment';
import App from './App.vue';
import router from './router';
import store from './store';
import ru from './translations/ru';
import Permissions from './utils/Permissions';
import '@/components';
import './registerServiceWorker';
import '@/assets/style/app.css';

Vue.use(VeeValidate);
Vue.use(moment);
Vue.config.productionTip = false;
Validator.localize('ru', ru);

Vue.prototype.$permissions = Permissions;
Vue.prototype.$hasPermission = (key) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    router.push({ name: 'login' });
    return false;
  }
  const permissions = [];
  user.roles.forEach((role) => {
    role.permissions.forEach((permission) => {
      permissions.push(permission);
    });
  });
  return !!permissions.find(permission => permission.name === key);
};

Vue.filter('roundUp', (value) => {
  const precision = 10 ** 2;
  return Math.ceil(value.toFixed(4) * precision) / precision;
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

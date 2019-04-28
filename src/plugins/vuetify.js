import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  options: {
    customProperties: true,
  },
  theme: {
    primary: localStorage.getItem('primary') || '#1976D2',
    secondary: localStorage.getItem('secondary') || '#424242',
    accent: localStorage.getItem('accent') || '#82B1FF',
  },
  iconfont: 'md',
});

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';

Vue.use(Vuetify, {
  options: {
    customProperties: true,
  },
  theme: {
    primary: localStorage.getItem('primary') || '#343445', // Dashboard card's and Toolbar color
    secondary: localStorage.getItem('secondary') || '#424242', // Menu icons and text's color
    accent: localStorage.getItem('accent') || '#00A3EA', // Dashboard card title's color
    dashboardPrimary: localStorage.getItem('dashboardPrimary') || '#2B2B38', // Dashboard background color
    dashboardSecondary: localStorage.getItem('dashboardSecondary') || '#00A4EB', // Dashboard charts color
    dashboardTertiary: localStorage.getItem('dashboardTertiary') || '#FFF', // Dashboard subtitles color
    dashboardBorder: localStorage.getItem('dashboardBorder') || '#3E3E4D', // Dashboard card border color
  },
  iconfont: 'md',
});

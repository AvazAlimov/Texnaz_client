import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';


Vue.use(Vuetify, {
  theme: {
    primary: localStorage.getItem('primary') || '#707070',
  },
  iconfont: 'md',
});

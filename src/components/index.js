import Vue from 'vue';
import Expanses from './Expanses.vue';

const Components = {
  Expanses,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

export default Components;

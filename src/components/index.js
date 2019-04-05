import Vue from 'vue';
import Expanses from './Expanses.vue';
import SearchProduct from './SearchProduct.vue';

const Components = {
  Expanses,
  SearchProduct,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

export default Components;

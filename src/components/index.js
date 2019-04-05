import Vue from 'vue';
import Item from './Item.vue';
import Expanses from './Expanses.vue';
import SelectionItem from './SelectionItem.vue';
import SearchProduct from './SearchProduct.vue';

const Components = {
  Item,
  Expanses,
  SelectionItem,
  SearchProduct,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

export default Components;

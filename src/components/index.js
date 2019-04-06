import Vue from 'vue';
import Item from './Item.vue';
import Info from './Info.vue';
import Expanses from './Expanses.vue';
import CustomsItem from './CustomsItem.vue';
import SelectionItem from './SelectionItem.vue';
import SearchProduct from './SearchProduct.vue';

const Components = {
  Item,
  Info,
  Expanses,
  CustomsItem,
  SelectionItem,
  SearchProduct,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

export default Components;

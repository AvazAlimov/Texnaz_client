import Vue from 'vue';
import Info from './Info.vue';
import Expanses from './Expanses.vue';
import PriceItem from './PriceItem.vue';
import CustomsItem from './CustomsItem.vue';
import SelectionItem from './SelectionItem.vue';
import SearchProduct from './SearchProduct.vue';
import FirstCostItem from './FirstCostItem.vue';
import SecondCostItem from './SecondCostItem.vue';

const Components = {
  Info,
  Expanses,
  PriceItem,
  CustomsItem,
  SelectionItem,
  SearchProduct,
  FirstCostItem,
  SecondCostItem,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

export default Components;

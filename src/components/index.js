import Vue from 'vue';
import Card from './Card.vue';
import Info from './Info.vue';
import Expanses from './Expanses.vue';
import PriceItem from './PriceItem.vue';
import CustomsItem from './CustomsItem.vue';
import PricesTable from './PricesTable.vue';
import SelectionItem from './SelectionItem.vue';
import SearchProduct from './SearchProduct.vue';
import FirstCostItem from './FirstCostItem.vue';
import SecondCostItem from './SecondCostItem.vue';
import DistributeItems from './DistributeItems.vue';

import SearchStock from './warehouse/SearchStock.vue';
import PreStockItem from './warehouse/PreStockItem.vue';
import AcceptanceItem from './warehouse/AcceptanceItem.vue';

const Components = {
  Card,
  Info,
  Expanses,
  PriceItem,
  CustomsItem,
  PricesTable,
  SelectionItem,
  SearchProduct,
  FirstCostItem,
  SecondCostItem,
  DistributeItems,

  PreStockItem,
  SearchStock,
  AcceptanceItem,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

export default Components;

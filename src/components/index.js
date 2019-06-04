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
import ReturnItem from './warehouse/ReturnItem.vue';
import UserBookings from './warehouse/UserBookings.vue';
import SaleItem from './warehouse/SaleItem.vue';

import Map from './analytics/Map.vue';
import ExpenseProperty from './expenses/ExpenseProperty.vue';
import EditExpense from './expenses/EditExpense.vue';
import ExpenseAnalytics from './expenses/ExpenseAnalytics.vue';

import NewPayment from './payments/NewPayment.vue';

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

  SaleItem,
  PreStockItem,
  SearchStock,
  AcceptanceItem,
  ReturnItem,
  UserBookings,

  Map,
  ExpenseProperty,
  EditExpense,
  ExpenseAnalytics,

  NewPayment,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

export default Components;

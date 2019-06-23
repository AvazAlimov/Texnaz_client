import Vue from 'vue';
import Card from './Card.vue';

// CALCULATOR
import Info from './calculator/Info.vue';
import Expanses from './calculator/Expanses.vue';
import PriceItem from './calculator/PriceItem.vue';
import CustomsItem from './calculator/CustomsItem.vue';
import SelectionItem from './calculator/SelectionItem.vue';
import SearchProduct from './calculator/SearchProduct.vue';
import FirstCostItem from './calculator/FirstCostItem.vue';
import SecondCostItem from './calculator/SecondCostItem.vue';

// WAREHOUSE
import SearchStock from './warehouse/SearchStock.vue';
import PreStockItem from './warehouse/PreStockItem.vue';
import AcceptanceItem from './warehouse/AcceptanceItem.vue';
import ReturnItem from './warehouse/ReturnItem.vue';
import UserBookings from './warehouse/UserBookings.vue';
import SaleItem from './warehouse/SaleItem.vue';
import StockBookings from './warehouse/StockBookings.vue';
import StockItem from './warehouse/StockItem.vue';
import StockItemExpanded from './warehouse/StockItemExpanded.vue';

import Map from './analytics/Map.vue';
import ExpenseProperty from './expenses/ExpenseProperty.vue';
import EditExpense from './expenses/EditExpense.vue';
import ExpenseAnalytics from './expenses/ExpenseAnalytics.vue';
import NewPayment from './payments/NewPayment.vue';
import UserSales from './shipment/UserSales.vue';

import Motivations from './managers/Motivations.vue';

const Components = {
  Card,

  Info,
  Expanses,
  PriceItem,
  CustomsItem,
  SelectionItem,
  SearchProduct,
  FirstCostItem,
  SecondCostItem,

  SaleItem,
  PreStockItem,
  SearchStock,
  AcceptanceItem,
  ReturnItem,
  UserBookings,
  StockBookings,
  StockItem,
  StockItemExpanded,

  Map,
  ExpenseProperty,
  EditExpense,
  ExpenseAnalytics,
  NewPayment,
  UserSales,

  Motivations,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

export default Components;

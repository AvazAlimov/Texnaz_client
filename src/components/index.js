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

// Tabels
import DebtClient from './tabels/DebtClient.vue';
import LateDebt from './tabels/LateDebt.vue';
import Sale from './tabels/Sale.vue';
import Payment from './tabels/Payment.vue';
import Rate from './tabels/Rate.vue';
import TotalStatistics from './tabels/TotalStatistics.vue';
import ManyStatistics from './tabels/ManyStatistics.vue';

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
import ReturnWarehouseItem from './warehouse/ReturnWarehouseItem.vue';

import Map from './analytics/Map.vue';
import GraphCard from './analytics/GraphCard.vue';
import PieChart from './analytics/PieChart.vue';

import Guage from './analytics/Guage.vue';
import ManagerStatistics from './analytics/ManagerStatistics.vue';
import ClientData from './analytics/ClientData.vue';
import RateCard from './analytics/RateCard.vue';

import ExpenseProperty from './expenses/ExpenseProperty.vue';
import EditExpense from './expenses/EditExpense.vue';
import ExpenseAnalytics from './expenses/ExpenseAnalytics.vue';
import Revenue from './expenses/Revenue.vue';
import NewPayment from './payments/NewPayment.vue';

import UserSales from './shipment/UserSales.vue';
import FilteredSales from './shipment/FilteredSales.vue';

import Motivations from './motivations/Motivations.vue';

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

  DebtClient,
  LateDebt,
  Sale,
  Payment,
  Rate,
  TotalStatistics,
  ManyStatistics,

  SaleItem,
  PreStockItem,
  SearchStock,
  AcceptanceItem,
  ReturnItem,
  UserBookings,
  StockBookings,
  StockItem,
  StockItemExpanded,
  ReturnWarehouseItem,

  Map,
  GraphCard,
  PieChart,
  RateCard,

  Guage,
  ManagerStatistics,
  ClientData,

  ExpenseProperty,
  EditExpense,
  ExpenseAnalytics,
  Revenue,
  NewPayment,

  UserSales,
  FilteredSales,

  Motivations,
};

Object.keys(Components).forEach((name) => {
  Vue.component(name, Components[name]);
});

export default Components;

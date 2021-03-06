<template lang="pug">
  .white.border
    v-layout(align-center).px-4.py-2
      v-flex(xs6)
        v-layout(v-if="status")
          v-menu(
                  v-model="startMenu"
                  full-width
                  min-width="290px"
                  :close-on-content-click="false"
          ).ma-2
            template(v-slot:activator="{ on }")
              v-text-field(
                  readonly
                  v-model="startDate"
                  v-on="on"
                  label="От"
              )
            v-date-picker(
                v-model="startDate"
                @input="() => { startMenu = false }"
            )
          v-menu(
                  v-model="endMenu"
                  full-width
                  min-width="290px"
                  :close-on-content-click="false"
          ).ma-2
            template(v-slot:activator="{ on }")
                v-text-field(
                    readonly
                    v-model="endDate"
                    v-on="on"
                    label="До"
                )
            v-date-picker(
                v-model="endDate"
                @input="() => { endMenu = false }"
            )
          v-select(
              v-model="selectedstatus"
              :items="allstatus"
              item-text="name"
              item-value="id"
              label="Статус"
          ).ma-2
      v-spacer
      v-text-field(
        v-model="tableSearching"
        append-icon="search"
        label="Поиск по таблице"
      ).ma-2
      v-text-field(
        v-model="search"
        append-icon="search"
        label="Поиск по продукту"
      ).ma-2
    v-data-table(
      :hide-actions="!status && !accounting"
      :headers="headers"
      :items="filteredData"
      :loading="loading"
      :search="tableSearching"
      disable-initial-sort
      )
      template(v-slot:items="props")
        td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
        td {{ props.item.number }}
        td {{ props.item.warehouse.name }} {{ props.item.warehouse.company }}
        td {{ props.item.client.icc }}
        td {{ props.item.client.name }}
        td {{ props.item.manager.name }}
        td
          div(v-if="!accounting")
            | {{ $getTotalPrice(props.item, exchangeRate, officialRate) || 0 | roundUp }}$
          div(v-if="accounting")
            | {{ getAccountingPrice(props.item) || 0 | roundUp }}сум
        td {{ accounting ? '' : types.find(type => type.id == props.item.type).name }}
        td {{ (accounting ? '' : readable(props.item.client.balance)) }}
        td
          v-layout(row)
            v-btn.ma-0(
              flat icon color="secondary"
              :to="{ name: 'shipment', params: {id: props.item.id},query:{ accounting }}")
              v-icon(small) visibility
            v-btn.ma-0(
              v-if="props.item.approved < 1"
              flat icon color="secondary"
              :to="{ name: 'sale_edit', params:{id:props.item.warehouseId,saleId:props.item.id}}")
              v-icon(small) edit
            v-btn.ma-0(@click="remove(props.item.id)"
              v-if="props.item.approved < 1"
              flat icon color="red")
              v-icon(small) delete
            v-chip(
              v-if="status"
              :color="props.item.isClosed ? 'green' : 'red'"
              outline
              disabled
              small
            )
              v-icon(small) {{ props.item.isClosed ? 'done_all' : 'check' }}
</template>

<script>
import Sale from '@/services/Sale';
import shipmentTypes from '@/assets/shipment_types.json';
import shipmentPayments from '@/assets/shipment_payments.json';

export default {
  name: 'FilteredSales',
  props: {
    sales: {
      required: true,
      type: Array,
    },
    allSales: {
      type: Array,
      required: true,
    },
    exchangeRate: {
      required: true,
    },
    officialRate: {
      required: true,
    },
    accounting: {
      type: Boolean,
    },
    status: {
      type: Boolean,
    },
  },
  data: () => ({
    loading: false,
    search: '',
    tableSearching: '',
    payments: shipmentPayments,
    types: shipmentTypes,
    finished: false,
    startMenu: false,
    startDate: '',
    endMenu: false,
    endDate: '',
    allstatus: [
      {
        id: 0,
        name: 'Все',
      },
      {
        id: 1,
        name: 'Закрытые',
      },
      {
        id: 2,
        name: 'Незакрытые',
      },
    ],
    selectedstatus: 0,
  }),
  computed: {
    filteredSales() {
      return this.filterDate(this.selectedstatus);
    },
    filteredData() {
      return this.filteredSales
        .filter((sale) => {
          if (this.$hasRole(8)) {
            // Territory manager
            return sale.manager.territoryId === this.$getUserTerritory();
          } if (this.$hasRole(7)) {
            return sale.controllerId === this.$getUserId();
          }
          return true;
        }).filter((sale) => {
          const items = sale.items.map(({ stock }) => stock.product);
          const mappedByKeys = items.map((item) => {
            const values = Object.keys(item).map(key => (item[key] ? item[key].toString() : ''));
            return values.filter(value => !!value.match(this.search)); // ["", "", ""]
          });
          return !!mappedByKeys.filter(item => !!item.length).length;
        });
    },
    headers() {
      return [
        {
          text: 'Дата',
          value: 'createdAt',
        },
        {
          text: 'Номер',
          value: 'id',
        },
        {
          text: 'Склад',
          value: 'warehouse.name',
        },
        {
          text: 'ИКК',
          value: 'client.icc',
        },
        {
          text: 'Клиент',
          value: 'client.name',
        },
        {
          text: 'Менеджер',
          value: 'manager.name',
        },
        {
          text: 'Сумма',
          value: 'price',
          sortable: false,
        },
        {
          text: this.accounting ? '' : 'Тип оплаты',
          value: 'type',
          sortable: !this.accounting,
        },
        {
          text: this.accounting ? '' : 'Баланс',
          value: 'balance',
          sortable: false,
        },
        {
          sortable: false,
        },
      ];
    },
  },
  watch: {
    finished(value) {
      console.log(value);
    },
  },
  methods: {
    getAnArray(array) {
      return array.reduce((a, b) => a.concat(b), []);
    },
    saleItems() {
      const productArray = this.sales.map(({ items }) => items.map(({ stock }) => stock.product));
      return this.getAnArray(productArray);
    },
    filterDate(status) {
      return this.sales.filter((sale) => {
        const dateSale = new Date(sale.createdAt);
        const start = new Date(this.startDate === '' ? null : this.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(this.endDate === '' ? '12-12-9999' : this.endDate);
        end.setHours(23, 59, 59, 59);
        switch (status) {
          case 1: return dateSale > start && dateSale < end && (sale.isClosed === true);
          case 2: return dateSale > start && dateSale < end && (sale.isClosed === false);
          default:
            return dateSale > start && dateSale < end;
        }
      });
    },
    balance(client) {
      return this.$options.filters.readable(this.$options.filters.roundUp(
        this.$getClientBalance(client, this.allSales
          .filter(el => el.clientId === client.id && el.approved)),
      ));
    },
    readable(value) {
      return this.$options.filters.readable(
        this.$options.filters.roundUp(value),
      );
    },
    getAccountingPrice(sale) {
      let total = 0;
      switch (sale.type) {
        case 1:
          sale.items.forEach((item) => {
            const itemPrice = this.$price(item.price, this.officialRate, this.exchangeRate);
            total += (itemPrice.firstPrice * item.quantity
                  * (100 - item.discount) / 100);
          });
          break;
        case 2:
          // mixPriceNonCash
          sale.items.forEach((item) => {
            const itemPrice = this.$price(item.price, this.officialRate, this.exchangeRate);
            total += (itemPrice.mixPriceNonCash * item.quantity
                  * (100 - item.discount) / 100);
          });
          break;
        case 3:
          // mixPriceNonCash
          sale.items.forEach((item) => {
            const itemPrice = this.$price(item.price, this.officialRate, this.exchangeRate);
            total += (itemPrice.mixPriceNonCash * item.quantity
                        * (100 - item.discount) / 100);
          });
          break;
        case 4:
          // commissionPriceUzs
          sale.items.forEach((item) => {
            const itemPrice = this.$price(item.price, this.officialRate, this.exchangeRate);
            total += (itemPrice.mixPriceNonCash * item.quantity
                  * (100 - item.discount) / 100);
          });
          break;
        case 5:
          // commissionPriceUsd
          sale.items.forEach((item) => {
            const itemPrice = this.$price(item.price, this.officialRate, this.exchangeRate);
            total += (itemPrice.mixPriceNonCash * item.quantity
                  * (100 - item.discount) / 100);
          });
          break;
        default:
          break;
      }
      return total;
    },
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Sale.delete(id)
          .then(() => window.location.reload())
          .catch(error => this.$store.commit('setMessage', error.message));
      }
    },
  },
};
</script>

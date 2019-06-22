<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12 v-if="$hasRole(1) || $hasRole(3)")
      .white.border
        .title.ml-4.my-3 ОТГРУЗКИ
        v-divider
        v-data-table(
          hide-actions
          :headers="headers"
          :items="pendingSales"
          :loading="loading")
          template(v-slot:items="props")
            td {{ props.item.id }}
            td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td {{ props.item.warehouse.name }} {{ props.item.warehouse.company }}
            td {{ props.item.client.icc }}
            td {{ props.item.client.name }}
            td {{ props.item.manager.name }}
            td {{ getTotalPrice(props.item).toFixed(2) }} $
            td {{ types.find(type => type.id == props.item.type).name }}
            td {{ payments.find(payment => payment.id == props.item.form).name }}
            td {{ getClientBalance(props.item.client) }} $
            td
              v-btn.ma-0(
                flat icon color="secondary"
                :to="{ name: 'shipment', params: {id: props.item.id} }")
                v-icon(small) visibility
    v-flex(xs12 v-if="$hasRole(1) || $hasRole(3)")
      .white.border
        .title.ml-4.my-3 СОГЛАСОВАННЫЕ ОТГРУЗКИ
        v-divider
        v-data-table(
          hide-actions
          :headers="headers"
          :items="approvedSales"
          :loading="loading")
          template(v-slot:items="props")
            td {{ props.item.id }}
            td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td {{ props.item.warehouse.name }} {{ props.item.warehouse.company }}
            td {{ props.item.client.icc }}
            td {{ props.item.client.name }}
            td {{ props.item.manager.name }}
            td {{ getTotalPrice(props.item).toFixed(2) }} $
            td {{ types.find(type => type.id == props.item.type).name }}
            td {{ payments.find(payment => payment.id == props.item.form).name }}
            td {{ getClientBalance(props.item.client) }} $
            td
              v-btn.ma-0(
                flat icon color="secondary"
                :to="{ name: 'shipment', params: {id: props.item.id} }")
                v-icon(small) visibility
    v-flex(xs12)
      .white.border
        .title.ml-4.my-3 МОИ ОТГРУЗКИ
        v-divider
        v-data-table(
            hide-actions
            :headers="headers"
            :items="mySales"
            :loading="loading")
            template(v-slot:items="props")
              tr(:class="{\
                'green lighten-3': props.item.approved > 0,\
                'red lighten-3': props.item.approved < 0\
                }")
                td {{ props.item.id }}
                td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
                td {{ props.item.warehouse.name }} {{ props.item.warehouse.company }}
                td {{ props.item.client.icc }}
                td {{ props.item.client.name }}
                td {{ props.item.manager.name }}
                td {{ getTotalPrice(props.item).toFixed(2) }} $
                td {{ types.find(type => type.id == props.item.type).name }}
                td {{ payments.find(payment => payment.id == props.item.form).name }}
                td {{ getClientBalance(props.item.client) }} $
                td
                  v-btn.ma-0(
                    flat icon color="secondary"
                    :to="{ name: 'shipment', params: {id: props.item.id} }")
                    v-icon(small) edit
</template>

<script>
import Sale from '@/services/Sale';
import Configuration from '@/services/Configuration';

export default {
  name: 'Shipments',
  data: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    loading: false,
    configurations: [],
    exchangeRate: 1,
    officialRate: 1,
    payments: [
      {
        id: 1,
        name: 'Предоплата',
      },
      {
        id: 2,
        name: 'Частичная',
      },
      {
        id: 3,
        name: 'Реализация',
      },
    ],
    types: [
      {
        id: 1,
        name: 'B2C',
        key: 'firstPrice',
      },
      {
        id: 2,
        name: 'Цена с наценкой',
        key: 'mixPrice',
      },
      {
        id: 3,
        name: 'B2B',
        key: 'secondPrice',
      },
    ],
    sales: [],
    headers: [
      {
        text: 'Номер',
        value: 'id',
      },
      {
        text: 'Дата',
        value: 'createdAt',
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
        text: 'Тип оплаты',
        value: 'type',
      },
      {
        text: 'Тип расчета',
        value: 'form',
      },
      {
        text: 'Баланс',
        value: 'balance',
        sortable: false,
      },
      {
        sortable: false,
      },
    ],
  }),
  computed: {
    pendingSales() {
      return this.sales.filter(sale => sale.approved < 1);
    },
    approvedSales() {
      return this.sales.filter(sale => sale.approved === 1);
    },
    mySales() {
      return this.sales.filter(sale => sale.managerId === this.user.id);
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Sale.getAll(),
        Configuration.getAll(),
      ])
        .then((results) => {
          [this.sales, this.configurations] = results;
          this.exchangeRate = (this.configurations.find(conf => conf.id === 4)).value;
          this.officialRate = (this.configurations.find(conf => conf.id === 5)).value;
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    getTotalPrice(sale) {
      let price = 0;
      switch (sale.type) {
        case 1:
          sale.items.forEach((item) => {
            price += (item.price.firstPrice * item.quantity
                      * (100 - item.discount) / 100)
                      / this.officialRate;
          });
          break;
        case 2:
          sale.items.forEach((item) => {
            price += (item.price.mixPriceNonCash / this.exchangeRate
                      + item.price.mixPriceCash)
                      * item.quantity
                      * (100 - item.discount) / 100;
          });
          break;
        case 3:
          sale.items.forEach((item) => {
            price += item.price.secondPrice
                      * item.quantity
                      * (100 - item.discount) / 100;
          });
          break;
        default:
          break;
      }
      return price;
    },
    getClientBalance(client) {
      let balance = 0;
      if (client.payments) {
        client.payments.forEach((payment) => {
          if (payment.approved) { balance += payment.sum / payment.ratio; }
        });
      }
      return balance;
    },
  },
  created() {
    this.getAll();
  },
};
</script>

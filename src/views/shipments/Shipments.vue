<template lang="pug">
  div
    v-layout(row wrap v-if="$route.name == 'shipments'")
      v-flex(xs12).mb-3
        .title ОТГРУЗКИ
      v-flex(xs12)
        .white.border
          v-data-table(
            hide-actions
            :headers="headers"
            :items="sales"
            :loading="loading")
            template(v-slot:items="props")
              td {{ props.item.id }}
              td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td {{ props.item.client.icc }}
              td {{ props.item.client.name }}
              td {{ props.item.manager.name }}
              td {{ getTotalPrice(props.item).toFixed(2) }} $
              td {{ types.find(type => type.id == props.item.type).name }}
              td {{ payments.find(payment => payment.id == props.item.form).name }}
              td {{ getClientBalance(props.item.client) }} $
    router-view
</template>

<script>
import Sale from '@/services/Sale';
import Configuration from '@/services/Configuration';

export default {
  name: 'Shipments',
  data: () => ({
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
        text: 'Number',
        value: 'id',
      },
      {
        text: 'Date',
        value: 'createdAt',
      },
      {
        text: 'ICC',
        value: 'client.icc',
      },
      {
        text: 'Client',
        value: 'client.name',
      },
      {
        text: 'Manger',
        value: 'manager.name',
      },
      {
        text: 'Price',
        value: 'price',
      },
      {
        text: 'Type',
        value: 'type',
      },
      {
        text: 'Form',
        value: 'form',
      },
      {
        text: 'Balance',
        value: 'balance',
      },
    ],
  }),
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

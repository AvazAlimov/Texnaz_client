<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      .white.border
        v-data-table(
          hide-actions
          :headers="headers"
          :items="sales"
          :loading="loading"
          disable-initial-sort)
          template(v-slot:items="props")
            tr(:class="{\
              'green lighten-3': props.item.approved > 0,\
              'red lighten-3': props.item.approved < 0\
            }")
              td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td {{ props.item.number }}
              td {{ props.item.approved == 1 ? 'Согласован' : 'Не согласован' }}
              td {{ props.item.warehouse.name }} {{ props.item.warehouse.company }}
              td {{ props.item.client.icc }}
              td {{ props.item.client.name }}
              td {{ props.item.manager.name }}
              td {{ $getTotalPrice(props.item, exchangeRate, officialRate) | roundUp }}$
              td {{ types.find(type => type.id == props.item.type).name }}
              td {{ payments.find(payment => payment.id == props.item.form).name }}
              td {{ $getClientBalance(props.item.client) }} $
              td
                v-btn.ma-0(
                  flat icon color="secondary"
                  :to="{ name: 'shipment', params: {id: props.item.id} }")
                  v-icon(small) visibility
</template>

<script>
import Sale from '@/services/Sale';
import Configuration from '@/services/Configuration';
import shipmentTypes from '@/assets/shipment_types.json';
import shipmentPayments from '@/assets/shipment_payments.json';

export default {
  name: 'SalesInformation',
  data: () => ({
    loading: false,
    configurations: [],
    exchangeRate: 1,
    officialRate: 1,
    payments: shipmentPayments,
    types: shipmentTypes,
    sales: [],
    headers: [
      {
        text: 'Дата',
        value: 'createdAt',
      },
      {
        text: 'Номер',
        value: 'id',
      },
      {
        text: 'Статус',
        value: 'approved',
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
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Sale.getAll(),
        Configuration.getAll(),
      ])
        .then((results) => {
          [this.sales, this.configurations] = results;
          this.sales = this.sales.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
          this.exchangeRate = (this.configurations.find(conf => conf.id === 4)).value;
          this.officialRate = (this.configurations.find(conf => conf.id === 5)).value;
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

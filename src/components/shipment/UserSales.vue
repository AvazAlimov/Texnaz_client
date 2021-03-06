<template lang="pug">
  .white.border
    v-layout(wrap)
      .title.mx-4.my-3 МОИ ОТГРУЗКИ
      v-spacer
      .subheading.mx-4.my-3 Общая сумма: {{ totalPrice | roundUp | readable }}
    v-divider
    v-data-table(
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
          td {{ (props.item.client.balance || 0) | roundUp | readable}} $
          td
            v-layout(row)
              v-btn.ma-0(
                v-if="props.item.approved < 1"
                flat icon color="secondary"
                :to="{ name: 'sale_edit', params:{id:props.item.warehouseId,saleId:props.item.id}}")
                v-icon(small) edit
              v-btn.ma-0(
                v-if="props.item.approved == 1"
                flat icon color="secondary"
                :to="{ name: 'shipment', params: {id: props.item.id} }")
                v-icon(small) visibility
              v-btn.ma-0(@click="remove(props.item.id)"
                v-if="props.item.approved < 1"
                flat icon color="red")
                v-icon(small) delete
</template>

<script>
import Sale from '@/services/Sale';
import Configuration from '@/services/Configuration';
import shipmentTypes from '@/assets/shipment_types.json';
import shipmentPayments from '@/assets/shipment_payments.json';

export default {
  name: 'UserSales',
  props: {
    userId: {
      required: true,
    },
  },
  data: () => ({
    loading: false,
    configurations: [],
    exchangeRate: 1,
    officialRate: 1,
    totalPrice: 0,
    sales: [],
    allSales: [],
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
    payments: shipmentPayments,
    types: shipmentTypes,
  }),
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Sale.getByManagerId(this.userId),
        Configuration.getAll(),
        Sale.getAll(),
      ])
        .then((results) => {
          [this.sales, this.configurations, this.allSales] = results;
          this.sales = this.sales.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
          this.exchangeRate = (this.configurations.find(conf => conf.id === 4)).value;
          this.officialRate = (this.configurations.find(conf => conf.id === 5)).value;
          this.totalPrice = this.sales
            .map(el => this.$getTotalPrice(el, this.exchangeRate, this.officialRate))
            .reduce((a, b) => a + b, 0);
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
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
    remove(id) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      if (confirm('Это действие удалит элемент навсегда, вы уверены?')) {
        Sale.delete(id)
          .then(() => this.getAll())
          .catch(error => this.$store.commit('setMessage', error.message));
      }
    },
  },
  created() {
    this.getAll();
  },
};
</script>

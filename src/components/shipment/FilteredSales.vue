<template lang="pug">
  .white.border
    v-data-table(
      hide-actions
      :headers="headers"
      :items="sales"
      :loading="loading"
      disable-initial-sort)
      template(v-slot:items="props")
        td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
        td {{ props.item.number }}
        td {{ props.item.warehouse.name }} {{ props.item.warehouse.company }}
        td {{ props.item.client.icc }}
        td {{ props.item.client.name }}
        td {{ props.item.manager.name }}
        td
          div(v-if="!accounting")
            | {{ $getTotalPrice(props.item, exchangeRate, officialRate) | roundUp }}$
          div(v-if="accounting")
            | {{ getAccountingPrice(props.item) }}сум
        td {{ accounting ? '' : types.find(type => type.id == props.item.type).name }}
        td {{ accounting ? '' : balance(props.item.client) }}
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
  },
  data: () => ({
    loading: false,
    payments: shipmentPayments,
    types: shipmentTypes,
  }),
  computed: {
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
  methods: {
    balance(client) {
      return this.$options.filters.readable(this.$options.filters.roundUp(
        this.$getClientBalance(client, this.allSales
          .filter(el => el.id === client.id && el.approved)),
      ));
    },
    getAccountingPrice(sale) {
      let total = 0;
      switch (sale.type) {
        case 1:
          sale.items.forEach((item) => {
            total += (item.price.firstPrice * item.quantity
                  * (100 - item.discount) / 100);
          });
          break;
        case 2:
          // mixPriceNonCash
          sale.items.forEach((item) => {
            total += (item.price.mixPriceNonCash * item.quantity
                  * (100 - item.discount) / 100);
          });
          break;
        case 3:
          // mixPriceNonCash
          sale.items.forEach((item) => {
            total += (item.price.mixPriceNonCash * item.quantity
                        * (100 - item.discount) / 100);
          });
          break;
        case 4:
          // commissionPrice
          sale.items.forEach((item) => {
            total += (item.commissionPrice * item.quantity
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

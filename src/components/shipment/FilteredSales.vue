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
import shipmentTypes from '@/assets/shipment_types.json';
import shipmentPayments from '@/assets/shipment_payments.json';

export default {
  name: 'FilteredSales',
  props: {
    sales: {
      required: true,
      type: Array,
    },
    exchangeRate: {
      required: true,
      types: Number,
    },
    officialRate: {
      required: true,
      types: Number,
    },
  },
  data: () => ({
    loading: false,
    payments: shipmentPayments,
    types: shipmentTypes,
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
};
</script>

<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
            .border.white
                v-data-table(
                    :headers="headers"
                    :items="items"
                    hide-actions
                )
                    template(v-slot:items ="{ item }")
                        td {{ item.date | moment('YYYY-MM-DD HH-mm') }}
                        td {{ item.number }}
                        td {{ item.warehouse }}
                        td {{ item.icc }}
                        td {{ item.clientname }}
                        td {{ item.managername }}
                        td {{ types.find(el => el.id === item.type).name }}
                        td {{ forms.find(el => el.id === item.form).name }}
                        td {{ item.balance }}

</template>

<script>
import ReturnClient from '@/services/ReturnClient';
import ShipmentTypes from '@/assets/shipment_types.json';
import ShipmentPayments from '@/assets/shipment_payments.json';

export default {
  data: () => ({
    items: [],
    headers: [
      {
        text: 'Дата возвращения',
        value: 'date',
      },
      {
        text: 'Номер',
        value: 'number',
      },
      {
        text: 'Склады',
        value: 'warehouse',
      },
      {
        text: 'Икк',
        value: 'icc',
      },
      {
        text: 'Имя клиента',
        value: 'clientname',
      },
      {
        text: 'Имя менеджера',
        value: 'managername',
      },
      {
        text: 'Способ оплаты',
        value: 'type',
      },
      {
        text: 'Тип расчета',
        value: 'form',
      },
      {
        text: 'Баланс клиента',
        value: 'balance',
      },
    ],
    types: ShipmentTypes,
    forms: ShipmentPayments,
  }),
  methods: {
    getAll() {
      ReturnClient.getAll()
        .then((returns) => {
          this.items.push(...returns.map(item => ({
            date: item.createdAt,
            number: item.sale.number,
            warehouse: item.sale.warehouse.name,
            icc: item.sale.client.icc,
            clientname: item.sale.client.name,
            managername: item.sale.manager.name,
            type: item.sale.type,
            form: item.sale.form,
            balance: this.$getClientBalance(item.sale.client),
          })));
        })
        .catch((err) => { this.$store.setMessage('setMessage', err.message); });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style>

</style>

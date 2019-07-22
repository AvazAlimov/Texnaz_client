<template lang="pug">
    v-layout(wrap)
        .border.white
            v-data-table(
                :headers="headers"
                :items="users"
                hide-actions
            )
                template(v-slot:items="props")
                    DebtClient(:user="props.item")
</template>

<script>
import Sale from '@/services/Sale';
import Payment from '@/services/Payment';
import Configuration from '@/services/Configuration';

export default {
  data() {
    return {
      headers: [
        {
          text: 'Икк',
          value: 'icc',
        },
        {
          text: 'Наименование',
          value: 'name',
        },
        {
          text: 'Дата отгрузки',
          value: 'saleDate',
        },
        {
          text: 'Сумма отгрузки',
          value: 'salePrice',
        },
        {
          text: 'Дата оплаты',
          value: 'paymentDate',
        },
        {
          text: 'Сумма оплаты',
          value: 'paymentPrice',
        },
        {
          text: 'Менеджер',
          value: 'manager',
        },
        {
          text: 'Обшая сумма',
          value: 'debt',
        },
      ],
      users: [],
    };
  },
  methods: {
    getAll() {
      this.users = [];
      Promise.all([
        Sale.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
        Payment.getAll(),
      ]).then((result) => {
        // Main task: Remove objects from Payments if it exist in Sale then bind two array
        // and loop it to display on tabel
        let holder = result[3];
        result[0].forEach((element) => {
          // Removing, objects if the client in it exist in Sale also, from Payments array
          holder = holder.filter(el => element.client.id !== el.client.id);
        });
        // Connecting two types of Objects, Sale and Payment
        result[0].concat(holder).forEach((el) => {
          this.users.push({
            icc: el.client.icc,
            name: el.client.name,
            // To diffirentiate which object Sale or Payment .ratio prop added
            saleDate: el.ratio ? '-' : el.createdAt,
            salePrice: el.ratio ? '-' : this.$getTotalPrice(el, result[1].value, result[2].value),
            // In order to get last date and price of payment .reduce function used
            paymentDate: el.client.payments.reduce((first, next) => next.createdAt, ''),
            paymentPrice: el.client.payments.reduce((first, next) => next.sum, ''),
            manager: el.manager.name,
            debt: el.client.payments.map(payment => payment.sum).reduce((a, b) => a + b, 0)
               - (el.ratio ? 0 : this.$getTotalPrice(el, result[1].value, result[2].value)),
          });
        });
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style>

</style>

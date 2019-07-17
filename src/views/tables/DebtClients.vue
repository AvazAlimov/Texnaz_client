<template lang="pug">
    v-layout(wrap)
        .border.white
            v-data-table(
                :headers="headers"
                :items="users"
                hide-actions
            )
                template(v-slot:items="props")
                    DebtClients(:user="props.item")
</template>

<script>
import Sale from '@/services/Sale';
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
      users: [
        {
          icc: 12,
          name: 12,
          saleDate: 12,
          salePrice: 12,
          paymentDate: 12,
          paymentPrice: 12,
          manager: 12,
          debt: 12,
        },
        {
          icc: 12,
          name: 12,
          saleDate: 12,
          salePrice: 12,
          paymentDate: 12,
          paymentPrice: 12,
          manager: 12,
          debt: 12,
        },
        {
          icc: 12,
          name: 12,
          saleDate: 12,
          salePrice: 12,
          paymentDate: 12,
          paymentPrice: 12,
          manager: 12,
          debt: 12,
        },
        {
          icc: 12,
          name: 12,
          saleDate: 12,
          salePrice: 12,
          paymentDate: 12,
          paymentPrice: 12,
          manager: 12,
          debt: 12,
        },
      ],
    };
  },
  methods: {
    getAll() {
      this.users = [];
      Promise.all([
        Sale.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
      ]).then((result) => {
        result[0].forEach((el) => {
          this.users.push({
            icc: el.client.icc,
            name: el.client.name,
            saleDate: el.createdAt,
            salePrice: this.$getTotalPrice(el, result[1].value, result[2].value),
            paymentDate: el.client.payments.reduce((first, next) => next.createdAt, '-'),
            paymentPrice: el.client.payments.reduce((first, next) => next.sum, '-'),
            manager: el.manager.name,
            debt: this.$getTotalPrice(el, result[1].value, result[2].value)
             - el.client.payments.map(payment => payment.sum).reduce((a, b) => a + b, 0),
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

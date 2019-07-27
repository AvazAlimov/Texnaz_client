<template lang="pug">
    v-layout(wrap)
      v-flex(xs12)
        .border.white
          v-layout(wrap).pa-3
            v-menu(
              v-model="start"
              :close-on-content-click="false"
              min-width="290px"
            ).ma-3
              template(v-slot:activator="{ on }")
                v-text-field(
                  readonly
                  v-on="on"
                  v-model="startDate"
                  label="От"
                )
              v-date-picker(
                v-model="startDate"
                @input="start = false"
                :max="maximum"
              )
            v-menu(
              v-model="end"
              :close-on-content-click="false"
              full-width
              min-width="290px"
            ).ma-3
              template(v-slot:activator="{ on }")
                v-text-field(
                  readonly
                  v-on="on"
                  v-model="endDate"
                  label="До"
                )
              v-date-picker(
                v-model="endDate"
                @input="end = false"
                :max="maximum"
              )
            v-spacer
            v-text-field(
              v-model="search"
              append-icon="search"
              label="Поиск"
            )
          v-data-table(
                :headers="headers"
                :items="filteredData"
                hide-actions
                :search="search"
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
      search: '',
      startDate: (new Date()).toISOString().substring(0, 10),
      start: false,
      endDate: (new Date()).toISOString().substring(0, 10),
      end: false,
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
  computed: {
    maximum() {
      return (new Date()).toISOString().substring(0, 10);
    },
    filteredData() {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 59);
      return this.users.filter(el => new Date(el.saleDate !== '-' ? el.saleDate : el.paymentDate)
        .getTime() >= start.getTime() && new Date(el.saleDate !== '-' ? el.saleDate : el.paymentDate)
        .getTime() <= end.getTime());
    },
  },
  methods: {
    getDate(dateA, dateB) {
      return (new Date(dateA)).getTime() > (new Date(dateB)).getTime() ? dateB : dateA;
    },
    getAll() {
      this.users = [];
      Promise.all([
        Sale.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
        Payment.getAll(),
      ]).then((result) => {
        this.startDate = (new Date(this.getDate(result[0][0]
          .createdAt, result[3][0].createdAt))).toISOString().substring(0, 10);
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

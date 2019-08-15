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
                disable-initial-sort
            )
            template(v-slot:items="props")
              DebtClient(:user="props.item")
</template>

<script>
import Sale from '@/services/Sale';
import Payment from '@/services/Payment';
import ReturnClient from '@/services/ReturnClient';

export default {
  data() {
    return {
      search: '',
      startDate: (new Date()).toISOString().substring(0, 10),
      start: false,
      endDate: (new Date()).toISOString().substring(0, 10),
      end: false,
      items: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: 'Клиент ICC',
          value: 'clienticc',
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
          text: 'Дата отгрузки',
          value: 'saleDate',
        },
        {
          text: `Сумма отгрузки ($${this.readable(this.filteredData.map(el => el.salePrice).filter(el => el !== '-').reduce((a, b) => a + b, 0))})`,
          value: 'salePrice',
        },
        {
          text: 'Дата оплаты',
          value: 'paymentDate',
        },
        {
          text: `Сумма оплаты ($${this.readable(this.filteredData.map(el => el.paymentPrice).filter(el => el !== '-').reduce((a, b) => a + b, 0))})`,
          value: 'paymentPrice',
        },
        {
          text: 'Дата возврат',
          value: 'returnDate',
        },
        {
          text: 'Возврат цены',
          value: 'return price',
        },
        {
          text: 'Баланс клиента',
          value: 'clientbalance',
        },
      ];
    },
    maximum() {
      return (new Date()).toISOString().substring(0, 10);
    },
    filteredData() {
      return this.items.filter(el => (
        (el.saleDate.toString()).includes(this.search)
        || (el.salePrice.toString()).includes(this.search)
        || (el.paymentDate.toString()).includes(this.search)
        || (el.paymentPrice.toString()).includes(this.search)
        || (el.returnDate.toString()).includes(this.search)
        || (el.returnQuantity.toString()).includes(this.search)
        || (el.date.toString()).includes(this.search)
        || (el.clienticc.toString()).includes(this.search)
        || (el.clientname.toString()).includes(this.search)
        || (el.clientbalance.toString()).includes(this.search)
        || (el.managername.toString()).includes(this.search)));
    },
  },
  methods: {
    readable(value) {
      return this.$options.filters.readable(this.$options.filters.roundUp(value));
    },
    getDate(dateA, dateB) {
      return (new Date(dateA)).getTime() > (new Date(dateB)).getTime() ? dateB : dateA;
    },
    getAll() {
      this.users = [];
      Promise.all([
        Sale.getAll(),
        Payment.getAll(),
        ReturnClient.getAll(),
      ]).then((result) => {
        this.items = [];
        const [sales, payments, returns] = result;
        sales.filter(sale => sale.approved).forEach(sale => this.items.push({
          saleDate: sale.createdAt,
          salePrice: this.$getTotalPrice(sale, sale.exchangeRate, sale.officialRate),
          paymentDate: '-',
          paymentPrice: '-',
          returnDate: '-',
          returnQuantity: '-',
          date: sale.createdAt,
          clienticc: sale.client.icc,
          clientname: sale.client.name,
          clientbalance: this.$getClientBalance(sale.client, sales
            .filter(el => el.clientId === sale.clientId && el.approved)),
          managername: sale.manager.name,
        }));
        payments.forEach(payment => this.items.push({
          saleDate: '-',
          salePrice: '-',
          paymentDate: payment.createdAt,
          paymentPrice: payment.ratio === 1 ? payment.sum : (payment.sum / payment.ratio),
          returnDate: '-',
          returnQuantity: '-',
          date: payment.createdAt,
          clienticc: payment.client.icc,
          clientname: payment.client.name,
          clientbalance: this.$getClientBalance(payment.client, sales),
          managername: payment.manager.name,
        }));
        returns.forEach(returnItem => this.items.push({
          saleDate: '-',
          salePrice: '-',
          paymentDate: '-',
          paymentPrice: '-',
          returnDate: returnItem.createdAt,
          returnQuantity: this
            .$getTotalPrice(returnItem, returnItem.exchangeRate, returnItem.officialRate),
          date: returnItem.createdAt,
          clienticc: returnItem.client.icc,
          clientname: returnItem.client.name,
          clientbalance: this.$getClientBalance(returnItem.client, sales),
          managername: returnItem.manager.name,
        }));
        this.items.sort((a, b) => (a.date > b.date ? 1 : -1));
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

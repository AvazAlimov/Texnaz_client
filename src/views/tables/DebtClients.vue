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
                disable-initial-sort
            )
            template(v-slot:items="props")
              DebtClient(:user="props.item")
</template>

<script>
import Sale from '@/services/Sale';
import Payment from '@/services/Payment';
import ReturnClient from '@/services/ReturnClient';
import Territory from '@/services/Territory';

export default {
  data() {
    return {
      search: '',
      startDate: null,
      start: false,
      endDate: null,
      end: false,
      items: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: 'Икк',
          value: 'clienticc',
        },
        {
          text: 'Tерритория',
          value: 'territory',
        },
        {
          text: 'Область',
          value: 'province',
        },
        {
          text: 'Kлиент',
          value: 'clientname',
        },
        {
          text: 'Mенеджер',
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
          text: 'Дата возвратa',
          value: 'returnDate',
        },
        {
          text: ' Сумма возврата',
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
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 59);
      return this.items
        // .filter(({ userId }) => userId === this.$getUserId())
        .filter(({ managerPerson }) => this.filterUser(managerPerson))
        .filter(el => new Date(el.date).getTime() >= start.getTime()
          && new Date(el.date).getTime() <= end.getTime())
        .filter(el => (
          (el.saleDate.toString()).includes(this.search)
          || (el.salePrice.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.territory.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.province.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.paymentDate.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.paymentPrice.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.returnDate.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.returnQuantity.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.date.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.clienticc.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.clientname.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.clientbalance.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.managername.toString().toLowerCase()).includes(this.search.toLowerCase())));
    },
  },
  methods: {
    filterUser({ id, controllerId, territoryId }) {
      if (this.$hasRole(8)) {
        return territoryId === this.$getUserTerritory();
      }
      if (this.$hasRole(7)) {
        return (controllerId === this.$getUserId()) || (id === this.$getUserId());
      }
      if (this.$hasRole(2) && (!this.$hasRole(1))) {
        return id === this.$getUserId();
      }
      return true;
    },
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
        Payment.getApproved(),
        ReturnClient.getAll(),
        Territory.getAll(),
      ]).then((result) => {
        this.items = [];
        const [sales, payments, returns] = result;
        sales.filter(sale => sale.approved === 1 && sale.shipped === 1)
          .forEach(sale => this.items.push({
            saleDate: sale.createdAt,
            salePrice: this.$getTotalPrice(sale, sale.exchangeRate, sale.officialRate),
            paymentDate: '-',
            paymentPrice: '-',
            returnDate: '-',
            returnQuantity: '-',
            user: sale.user,
            date: sale.createdAt,
            currentClientBalance: sale.currentClientBalance
              - this.$getTotalPrice(sale, sale.exchangeRate, sale.officialRate),
            clienticc: sale.client.icc,
            clientname: sale.client.name,
            clientbalance: sale.client.balance || 0,
            managerPerson: sale.manager,
            managername: sale.manager.name,
            manager: sale.manager,
            territory: result[3].find(element => element.provinces
              .map(item => item.id).includes(sale.provinceId)).name,
            province: sale.province.name,
            userId: sale.userId,
          }));
        payments.forEach(payment => this.items.push({
          saleDate: '-',
          salePrice: '-',
          paymentDate: payment.createdAt,
          paymentPrice: payment.ratio === 1 ? payment.sum : (payment.sum / payment.ratio),
          returnDate: '-',
          user: payment.user,
          returnQuantity: '-',
          date: payment.createdAt,
          currentClientBalance: payment.currentClientBalance
            + (payment.ratio === 1 ? payment.sum : (payment.sum / payment.ratio)),
          clienticc: payment.client.icc,
          clientname: payment.client.name,
          clientbalance: payment.client.balance || 0,
          managerPerson: payment.manager,
          managername: payment.manager.name,
          manager: payment.manager,
          territory: result[3].find(element => element.provinces
            .map(item => item.id).includes(payment.provinceId)).name,
          province: payment.province.name,
          userId: payment.userId,
        }));
        returns.forEach(returnItem => this.items.push({
          saleDate: '-',
          salePrice: '-',
          paymentDate: '-',
          paymentPrice: '-',
          user: returnItem.user,
          returnDate: returnItem.createdAt,
          returnQuantity: this
            .$getTotalPrice(returnItem, returnItem.exchangeRate, returnItem.officialRate),
          date: returnItem.createdAt,
          clienticc: returnItem.client.icc,
          clientname: returnItem.client.name,
          clientbalance: returnItem.client.balance || 0,
          managerPerson: returnItem.manager,
          managername: returnItem.manager.name,
          manager: returnItem.manager,
          territory: result[3].find(element => element.provinces
            .map(item => item.id).includes(returnItem.client.provinceId)).name,
          province: returnItem.client.province.name,
          userId: returnItem.userId,
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

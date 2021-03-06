<template lang="pug">
  v-layout(wrap)
    v-flex(xs12)
      .border.white
        v-layout(wrap).pa-3
          v-menu(
            v-model="start"
            :clost-on-content-click="false"
            min-width="290px"
          ).ma-3
            template(v-slot:activator="{ on }")
              v-text-field(
                v-model="startDate"
                readonly
                v-on="on"
                label="От"
              )
            v-date-picker(
              v-model="startDate"
              @input="start = false"
              :max="maximum"
            )
          v-menu(
            v-model="end"
            :clost-on-content-click="false"
            min-width="290px"
          ).ma-3
            template(v-slot:activator="{ on }")
              v-text-field(
                v-model="endDate"
                readonly
                v-on="on"
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
            label="Поиск"
            append-icon="search"
          )
        v-data-table(
          :headers="headers"
          :pagination.sync="pagination"
          :rows-per-page-items="pagination.rowsPerPageItems"
          :total-items="totalNumbers"
          :loading="loading"
          :items="filteredData"
        )
          template(v-slot:items="props")
            Payment(:items="props.item")
</template>

<script>
import Payment from '@/services/Payment';
import Territory from '@/services/Territory';

export default {
  data() {
    return {
      loading: false,
      search: '',
      startDate: new Date(),
      start: false,
      endDate: new Date(),
      end: false,
      maximum: (new Date()).toISOString().substring(0, 10),
      totalNumbers: 0,
      territories: [],
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsPerPageItems: [5, 10, 25, { text: 'Все', value: -1 }],
      },
      items: [
        {
          number: 1,
          icc: 12,
          name: 7,
          manager: 7,
          date: 7,
          ratioPrice: 7,
          sum: 7,
          usd: 7,
          brand: 7,
          country: 7,
        },
      ],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: 'Номер',
          value: 'number',
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
          text: 'Икк',
          value: 'icc',
        },
        {
          text: 'Kлиент',
          value: 'name',
        },
        {
          text: 'Менеджер',
          value: 'manager',
        },
        {
          text: 'Добавлено',
          value: 'date',
        },
        {
          text: `Оплата в сум (${this.readable(this.filteredData.map(el => (el.sum === '-' ? 0 : el.sum)).reduce((a, b) => a + b, 0))} сум)`,
          value: 'sum',
        },
        {
          text: `Оплата в сум бн (${this.readable(this.filteredData.map(el => (el.sumbn === '-' ? 0 : el.sumbn)).reduce((a, b) => a + b, 0))} сум)`,
          value: 'ratioPrice',
        },
        {
          text: `Оплата в долларах (${this.readable(this.filteredData.map(el => (el.ratioPrice === '-' ? 0 : el.ratioPrice)).reduce((a, b) => a + b, 0))} $)`,
          value: 'ratioPrice',
        },
        {
          text: `Эквивалент в долларах (${this.readable(this.filteredData.map(el => el.usd).reduce((a, b) => a + b, 0))} $)`,
          value: 'usd',
        },
        {
          text: 'Курс (продажа)',
          value: 'date',
        },
        {
          sortable: false,
        },
      ];
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
        && new Date(el.date).getTime() <= end.getTime()
        && ((el.number.toString()).includes(this.search.toLowerCase())
        || (el.comment.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.territory.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.province.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.icc.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.name.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.manager.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.date.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.ratioPrice.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.usd.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.sum.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.sumbn.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.exchangeRate.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.brand.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.country.toString().toLowerCase()).includes(this.search.toLowerCase())));
    },
  },
  watch: {
    pagination: {
      handler(pagination) {
        this.getSync(pagination);
      },
      deep: true,
    },
  },
  methods: {
    getSync(pagination) {
      this.loading = true;
      Payment.getPagined(
        pagination.page - 1,
        pagination.rowsPerPage === -1 ? 'null' : pagination.rowsPerPage,
        1,
      )
        .then(({ total, data }) => {
          this.items = [];
          this.totalNumbers = total;
          data.forEach((el) => {
            this.items.push({
              number: el.number ? el.number : '-',
              territory: this.territories ? this.territories.find(element => element.provinces
                .map(item => item.id).includes(el.provinceId)).name : '-',
              province: el.province.name,
              icc: el.client.icc,
              name: el.client.name,
              comment: el.comment,
              managerPerson: el.manager,
              manager: el.manager.name,
              user: el.user,
              date: el.createdAt,
              ratioPrice: el.currency === 0 ? el.sum : '-',
              sum: el.currency === 1 ? el.sum : '-',
              sumbn: el.currency === 2 ? el.sum : '-',
              usd: el.ratio === 1 ? el.sum : el.sum / el.ratio,
              exchangeRate: el.exchangeRate,
              brand: el.brand ? el.brand.name : '-',
              country: el.brand ? el.brand.country : '-',
            });
          });
          this.loading = false;
        }).catch(err => this.$store.commit('setMessage', err.message));
    },
    setDates() {
      this.startDate.setDate(1);
      this.startDate = this.startDate.toISOString().substring(0, 10);
      this.endDate.setDate(1);
      this.endDate.setMonth(this.endDate.getMonth() + 1);
      this.endDate.setDate(this.endDate.getDate() - 1);
      this.endDate = this.endDate.toISOString().substring(0, 10);
    },
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
    getAll() {
      this.items = [];
      this.setDates();
      Promise.all([
        Territory.getAll(),
      ]).then((result) => {
        [this.territories] = result;
      }).catch(err => this.$commit('setMessage', err.message));
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style>

</style>

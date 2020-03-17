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
          :pagination.sync="pagination"
          :rows-per-page-items="pagination.rowsPerPageItems"
          :total-items="totalNumbers"
          :loading="loading"
          :items="filteredData"
        )
          template(v-slot:items="prop")
            Sale(:items="prop.item" :index="prop.index")
</template>

<script>
import Sales from '@/services/Sale';
import Configuration from '@/services/Configuration';
import Territory from '@/services/Territory';

export default {
  data() {
    return {
      search: '',
      loading: false,
      startDate: new Date(),
      endDate: new Date(),
      start: false,
      end: false,
      totalNumbers: 0,
      exchangeRate: 0,
      officialRate: 0,
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
          name: 12,
          date: 12,
          sum: 12,
          duration: 12,
          manager: 12,
          warehouse: 12,
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
          text: 'Дата отгрузки',
          value: 'date',
        },
        {
          text: `Сумма ($${this.readable(this.filteredData.map(el => el.sum).reduce((a, b) => a + b, 0))})`,
          value: 'sum',
        },
        {
          text: 'Консигнация',
          value: 'duration',
        },
        {
          text: 'Менеджер',
          value: 'manager',
        },
        {
          text: 'Склады',
          value: 'warehouse',
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
          && new Date(el.date).getTime() <= end.getTime()
          && ((el.number.toString().toLowerCase()).includes(this.search.toLowerCase())
            || (el.territory.toString().toLowerCase()).includes(this.search.toLowerCase())
            || (el.province.toString().toLowerCase()).includes(this.search.toLowerCase())
            || (el.icc.toString().toLowerCase()).includes(this.search.toLowerCase())
            || (el.name.toString().toLowerCase()).includes(this.search.toLowerCase())
            || (el.date.toString().toLowerCase()).includes(this.search.toLowerCase())
            || (el.sum.toString().toLowerCase()).includes(this.search.toLowerCase())
            || (el.duration.toString().toLowerCase()).includes(this.search.toLowerCase())
            || (el.manager.toString().toLowerCase()).includes(this.search.toLowerCase())
            || (el.warehouse.toString().toLowerCase()).includes(this.search.toLowerCase())));
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
      Sales.getPagined({
        page: pagination.page - 1,
        pageSize: pagination.rowsPerPage === -1 ? 'null' : pagination.rowsPerPage,
        approved: 1,
        shipped: 1,
      })
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
              date: el.createdAt,
              user: el.user,
              sum: this.$getTotalPrice(el, this.exchangeRate, this.officialRate),
              duration: el.days,
              userId: el.userId,
              managerPerson: el.manager,
              manager: el.manager.name,
              warehouse: el.warehouse.name,
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
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
        Territory.getAll(),
      ]).then((result) => {
        const [exchange, official, territories] = [result];
        this.exchangeRate = exchange ? exchange.value : 0;
        this.officialRate = official ? official.value : 0;
        this.territories = territories;
      }).catch(err => this.$store.commit('setMessage', err.message));
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style>

</style>

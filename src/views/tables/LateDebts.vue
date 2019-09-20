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
          )
            template(v-slot:items="props")
              LateDebt(:user="props.item")
</template>

<script>
import Sale from '@/services/Sale';
import Configuration from '@/services/Configuration';

export default {
  data() {
    return {
      search: '',
      startDate: (new Date()).toISOString().substring(0, 10),
      start: false,
      endDate: (new Date()).toISOString().substring(0, 10),
      maximum: (new Date()).toISOString().substring(0, 10),
      end: false,
      users: [
        {
          icc: 12,
          name: 12,
          saleDate: 12,
          salePrice: 12,
          manager: 12,
          daysLate: 12,
        },
      ],
    };
  },
  computed: {
    headers() {
      return [
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
          value: 'saleDate',
        },
        {
          text: `Сумма долга $${0}`,
          value: 'salePrice',
        },
        {
          text: 'Менеджер',
          value: 'manager',
        },
        {
          text: 'Количество дней',
          value: 'debt',
        },
      ];
    },
    readable(value) {
      return this.$options.filters.readable(this.$options.filters.roundUp(value));
    },
    filteredData() {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 59);
      return this.users.filter(el => new Date(el.saleDate).getTime() >= start.getTime()
          && new Date(el.saleDate).getTime() <= end.getTime()
          && ((el.icc.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.name.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.saleDate.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.salePrice.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.manager.toString().toLowerCase()).includes(this.search.toLowerCase())
          || (el.daysLate.toString().toLowerCase()).includes(this.search.toLowerCase())));
    },
  },
  methods: {
    getDuration(startTime, duration) {
      const mm = (new Date()).getTime() - (new Date(startTime)).getTime();
      const days = Math.round(mm / (3600000 * 24));
      return duration < days ? days : '';
    },
    getAll() {
      this.users = [];
      Promise.all([
        Sale.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
      ]).then((result) => {
        this.startDate = (new Date(result[0][0] ? result[0][0].createdAt : 0))
          .toISOString().substring(0, 10);
        result[0].forEach((el) => {
          const duration = this.getDuration(el.createdAt, el.days);
          if (duration) {
            this.users.push({
              icc: el.client.icc,
              name: el.client.name,
              saleDate: el.createdAt,
              salePrice: this.$getTotalPrice(el, result[1].value, result[2].value)
               - el.client.payments.map(payment => payment.sum).reduce((a, b) => a + b, 0),
              manager: el.manager.name,
              daysLate: duration,
            });
          }
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

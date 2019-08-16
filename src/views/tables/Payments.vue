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
          :items="filteredData"
          hide-actions
        )
          template(v-slot:items="props")
            Payment(:items="props.item")
</template>

<script>
import Payment from '@/services/Payment';

export default {
  data() {
    return {
      search: '',
      startDate: (new Date()).toISOString().substring(0, 10),
      start: false,
      endDate: (new Date()).toISOString().substring(0, 10),
      end: false,
      maximum: (new Date()).toISOString().substring(0, 10),
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
          text: `Оплата в доллора (${this.readable(this.filteredData.map(el => (el.ratioPrice === '-' ? 0 : el.ratioPrice)).reduce((a, b) => a + b, 0))} $)`,
          value: 'ratioPrice',
        },
        {
          text: `Эквивалент в доллора (${this.readable(this.filteredData.map(el => el.usd).reduce((a, b) => a + b, 0))} $)`,
          value: 'usd',
        },
        {
          text: 'Курс (продажа)',
          value: 'date',
        },
        {
          text: 'Бренд',
          value: 'brand',
        },
        {
          text: 'Страна',
          value: 'country',
        },
      ];
    },
    filteredData() {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 59);
      return this.items.filter(el => new Date(el.date).getTime() >= start.getTime()
        && new Date(el.date).getTime() <= end.getTime()
        && ((el.number.toString()).includes(this.search.toLowerCase())
        || (el.icc.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.name.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.manager.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.date.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.ratioPrice.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.usd.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.sum.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.exchangeRate.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.brand.toString().toLowerCase()).includes(this.search.toLowerCase())
        || (el.country.toString().toLowerCase()).includes(this.search.toLowerCase())));
    },
  },
  methods: {
    readable(value) {
      return this.$options.filters.readable(this.$options.filters.roundUp(value));
    },
    getAll() {
      this.items = [];
      Payment.getAll().then((data) => {
        this.startDate = (new Date(data[0] ? data[0].createdAt : 0)).toISOString().substring(0, 10);
        data.forEach((el) => {
          this.items.push({
            number: el.number ? el.number : '-',
            icc: el.client.icc,
            name: el.client.name,
            manager: el.manager.name,
            date: el.createdAt,
            ratioPrice: el.ratio === 1 ? el.sum : '-',
            sum: el.ratio === 1 ? '-' : el.sum,
            usd: el.ratio === 1 ? el.sum : el.sum / el.ratio,
            exchangeRate: el.exchangeRate,
            brand: el.brand ? el.brand.name : '-',
            country: el.brand ? el.brand.country : '-',
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

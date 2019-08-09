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
                @input="start = !start"
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
                  label="До"
                  v-on="on"
                )
              v-date-picker(
                v-model="endDate"
                @input="end = !end"
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
              :search="search"
              hide-actions
          )
              template(v-slot:items="props")
                  Rate(:items="props.item")
</template>

<script>
import Rate from '@/services/Rate';

export default {
  data() {
    return {
      startDate: (new Date()).toISOString().substring(0, 10),
      start: false,
      endDate: (new Date()).toISOString().substring(0, 10),
      end: false,
      maximum: (new Date()).toISOString().substring(0, 10),
      search: '',
      headers: [
        {
          text: 'Дата',
          value: 'date',
        },
        {
          text: 'Наименование',
          value: 'name',
        },
        {
          text: 'Курс доллара (Продажа)',
          value: 'exchangeRate',
        },
        {
          text: 'Курс доллара (Покупка)',
          value: 'officialRate',
        },
      ],
      items: [
        {
          date: new Date(),
          name: 12,
          exchangeRate: 12,
          officialRate: 12,
        },
      ],
    };
  },
  computed: {
    filteredData() {
      const start = new Date(this.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 59);
      return this.items.filter(el => new Date(el.date).getTime() >= start.getTime()
        && new Date(el.date).getTime() <= end.getTime());
    },
  },
  methods: {
    getAll() {
      this.items = [];
      Rate.getAll()
        .then((data) => {
          data.forEach((el) => {
            this.items.push({
              date: el.createdAt,
              name: el.user.name,
              exchangeRate: el.exchangeRate,
              officialRate: el.officialRate,
            });
          });
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

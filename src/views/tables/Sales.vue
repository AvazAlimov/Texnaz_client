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
        )
          template(v-slot:items="prop")
            Sale(:items="prop.item")
</template>

<script>
import Sales from '@/services/Sale';
import Configuration from '@/services/Configuration';

export default {
  data() {
    return {
      search: '',
      startDate: (new Date()).toISOString().substring(0, 10),
      start: false,
      endDate: (new Date()).toISOString().substring(0, 10),
      end: false,
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
          text: 'Икк',
          value: 'icc',
        },
        {
          text: 'Наименование',
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
      return this.items.filter(el => new Date(el.date).getTime() >= start.getTime()
          && new Date(el.date).getTime() <= end.getTime()
          && ((el.number.toString()).includes(this.search)
            || (el.icc.toString()).includes(this.search)
            || (el.name.toString()).includes(this.search)
            || (el.date.toString()).includes(this.search)
            || (el.sum.toString()).includes(this.search)
            || (el.duration.toString()).includes(this.search)
            || (el.manager.toString()).includes(this.search)
            || (el.warehouse.toString()).includes(this.search)));
    },
  },
  methods: {
    readable(value) {
      return this.$options.filters.readable(this.$options.filters.roundUp(value));
    },
    getAll() {
      this.items = [];
      Promise.all([
        Sales.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
      ]).then((result) => {
        this.startDate = (new Date(result[0][0].createdAt)).toISOString().substring(0, 10);
        result[0].forEach((el) => {
          this.items.push({
            number: el.number ? el.number : '-',
            icc: el.client.icc,
            name: el.client.name,
            date: el.createdAt,
            sum: this.$getTotalPrice(el, result[1].value, result[2].value),
            duration: el.days,
            manager: el.manager.name,
            warehouse: el.warehouse.name,
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

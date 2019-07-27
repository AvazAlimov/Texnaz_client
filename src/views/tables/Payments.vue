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
          :search="search"
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
      headers: [
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
          text: 'Менеджер',
          value: 'manager',
        },
        {
          text: 'Дата',
          value: 'date',
        },
        {
          text: 'Суммв',
          value: 'sum',
        },
        {
          text: 'Бренд',
          value: 'brand',
        },
        {
          text: 'Страна',
          value: 'country',
        },
      ],
      items: [
        {
          number: 1,
          icc: 12,
          name: 7,
          manager: 7,
          date: 7,
          sum: 7,
          brand: 7,
          country: 7,
        },
      ],
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
      return this.items.filter(el => new Date(el.date).getTime() >= start.getTime()
        && new Date(el.date).getTime() <= end.getTime());
    },
  },
  methods: {
    getAll() {
      this.items = [];
      Payment.getAll().then((data) => {
        this.startDate = (new Date(data[0].createdAt)).toISOString().substring(0, 10);
        data.forEach((el) => {
          this.items.push({
            number: el.number ? el.number : '-',
            icc: el.client.icc,
            name: el.client.name,
            manager: el.manager.name,
            date: el.createdAt,
            sum: el.sum,
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

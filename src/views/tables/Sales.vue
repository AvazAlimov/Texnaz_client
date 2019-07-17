<template lang="pug">
  v-layout(wrap)
    v-data-table(
      :headers="headers"
      :items="items"
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
          value: 'date',
        },
        {
          text: 'Сумма',
          value: 'sum',
        },
        {
          text: 'Дней',
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
      ],
      items: [
        {
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
  methods: {
    getAll() {
      this.items = [];
      Promise.all([
        Sales.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
      ]).then((result) => {
        result[0].forEach((el) => {
          this.items.push({
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

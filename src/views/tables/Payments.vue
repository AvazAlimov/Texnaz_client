<template lang="pug">
  v-layout(wrap)
    v-data-table(
      :headers="headers"
      :items="items"
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
  methods: {
    getAll() {
      this.items = [];
      Payment.getAll().then((data) => {
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

<template lang="pug">
    v-layout(wrap)
      v-flex(xs12)
        v-data-table(
            :headers="headers"
            :items="items"
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
          marketRate: 12,
        },
      ],
    };
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

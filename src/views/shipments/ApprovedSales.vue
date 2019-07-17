<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      FilteredSales(:sales="sales" :exchangeRate="exchangeRate" :officialRate="officialRate")
</template>

<script>
import Sale from '@/services/Sale';
import Configuration from '@/services/Configuration';

export default {
  name: 'ApprovedSales',
  data: () => ({
    exchangeRate: 1,
    officialRate: 1,
    sales: [],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Sale.getByProperty({
          approved: 1,
          managerId: (this.$hasRole(1) || this.$hasRole(3)) ? null : this.$getUserId(),
          shipped: 0,
        }),
        Configuration.getAll(),
      ])
        .then((results) => {
          [this.sales, this.configurations] = results;
          this.sales = this.sales.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
          this.exchangeRate = (this.configurations.find(conf => conf.id === 4)).value;
          this.officialRate = (this.configurations.find(conf => conf.id === 5)).value;
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

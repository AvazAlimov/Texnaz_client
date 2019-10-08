<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      FilteredSales(:sales="sales"
      :allSales="allSales"
      status
      :exchangeRate="exchangeRate"
      :officialRate="officialRate")
</template>

<script>
import Sale from '@/services/Sale';
import Configuration from '@/services/Configuration';

export default {
  name: 'FinishedSales',
  data: () => ({
    exchangeRate: 1,
    officialRate: 1,
    allSales: [],
    sales: [],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Sale.getByProperty({
          approved: 1,
          managerId: (this.$hasRole(1) || this.$hasRole(3)
          || this.$hasRole(7) || this.$hasRole(8)) ? null : this.$getUserId(),
          shipped: 1,
        }),
        Configuration.getAll(),
        Sale.getAll(),
      ])
        .then((results) => {
          [this.sales, this.configurations, this.allSales] = results;
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

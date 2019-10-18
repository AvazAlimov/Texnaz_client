<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      ProductAccounting(
        :sales="sales"
        :loading="loading")
</template>

<script>
import Sale from '@/services/Sale';

export default {
  name: 'ProductAccountant',
  data: () => ({
    loading: false,
    sales: [],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([
        Sale.getAll(),
      ])
        .then((results) => {
          [this.sales] = results;
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

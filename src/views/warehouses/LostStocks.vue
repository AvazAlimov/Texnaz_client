<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      .border.white
        v-data-table(
          :loading="loading"
          :headers="headers"
          :items="lostStocks"
          hide-actions)
          template(v-slot:items="props")
            td {{ props.item.stock.product.code || '-' }}
            td {{ props.item.stock.product.Brand.name }}
            td {{ props.item.stock.product.Brand.manufacturer || '-' }}
            td {{ props.item.stock.product.name }}
            td {{ props.item.stock.product.packing }}
            td {{ props.item.stock.product.color || '-' }}
            td {{ props.item.quantity }}
            td {{ props.item.quantity * props.item.stock.product.packing }}
</template>

<script>
import Lost from '@/services/Lost';

export default {
  name: 'LostStocks',
  data: () => ({
    loading: false,
    headers: [
      {
        text: 'Код',
        value: 'product.code',
      },
      {
        text: 'Бренд',
        value: 'product.Brand.name',
      },
      {
        text: 'Производитель',
        value: 'product.Brand.manufacturer',
      },
      {
        text: 'Наименование',
        value: 'product.name',
      },
      {
        text: 'Фасовка',
        value: 'product.packing',
      },
      {
        text: 'Цвет',
        value: 'product.color',
      },
      {
        text: 'Количество',
        value: 'quantity',
      },
      {
        text: 'Вес',
        value: 'quantity',
      },
    ],
    lostStocks: [],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Lost.getAll(this.$route.params.id)
        .then((lostStocks) => {
          this.lostStocks = lostStocks;
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

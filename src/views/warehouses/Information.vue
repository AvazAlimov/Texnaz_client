<template lang="pug">
  v-layout(row wrap align-center)
    v-flex(xs12)
      .border.white
        v-data-table(
          :headers="headers"
          :items="stocks"
          hide-actions
          :loading="loading")
          template(v-slot:items="props")
            td {{ props.item.product.Brand.name }}
            td {{ props.item.product.name }}
            td {{ props.item.product.packing }}
            td {{ props.item.product.color || '-' }}
            td {{ props.item.quantity }}
            td {{ props.item.quantity * props.item.product.packing }}
            td {{ props.item.arrival_date.substring(0, 10) }}
            td {{ props.item.expiry_date.substring(0, 10) }}
            td {{ props.item.defected ? 'поврежден' : '' }}
</template>

<script>
import Stock from '@/services/Stock';

export default {
  name: 'Information',
  data() {
    return {
      headers: [
        {
          text: 'Бренд',
          value: 'product.Brand.name',
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
          width: 100,
        },
        {
          text: 'Вес',
          value: 'weight',
        },
        {
          text: 'Дата прибытия',
          value: 'arrival_date',
          width: 100,
        },
        {
          text: 'Срок действия',
          value: 'expiry_date',
          width: 100,
        },
        {
          text: 'Состояние',
          value: 'defected',
        },
      ],
      stocks: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.stocks = [];
      Stock.getByWarehouse(this.$route.params.id)
        .then((stocks) => {
          this.stocks = [];
          this.stocks = stocks;
        })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>
</style>

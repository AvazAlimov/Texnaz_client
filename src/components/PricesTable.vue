<template lang="pug">
  v-data-table(
    :headers="headers"
    :items="prices"
    :loading="loading"
    hide-actions)
    template(v-slot:items="props")
      td {{ props.item.product.Brand.name }} {{ props.item.product.name }}
      td {{ props.item.product.packing }}
      td {{ props.item.firstPrice }}
      td {{ props.item.mixPriceNonCash }}
      td {{ props.item.mixPriceCash }}
      td {{ props.item.secondPrice }}
      td {{ props.item.createdAt | moment("HH:mm DD-MM-YYYY") }}
</template>

<script>
import Price from '@/services/Price';

export default {
  name: 'Pricestable',
  data() {
    return {
      loading: true,
      headers: [{
        text: 'Наименование',
        value: 'product.name',
      },
      {
        text: 'Фасовка',
        value: 'product.packing',
        align: 'center',
      },
      {
        text: 'Цена №1 (БН)',
        value: 'price',
        sortable: false,
      },
      {
        text: 'Цена №2 (БН)',
        value: 'price',
        sortable: false,
      },
      {
        text: 'Цена №2 (Н)',
        value: 'price',
        sortable: false,
      },
      {
        text: 'Цена №3 (Н)',
        value: 'price',
        sortable: false,
      },
      {
        text: 'Дата генерации',
        value: 'createdAt',
        sortable: false,
      }],
      prices: [],
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.prices = [];
      Price.getAll()
        .then((prices) => { this.prices = prices; })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

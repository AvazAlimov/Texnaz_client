<template lang="pug">
    .border.pa-4.white
        .title Поиск товаров
        v-layout(row wrap)
            v-flex(xs6)
                v-combobox(
                    v-model="brand"
                    :items="brands"
                    item-value="id"
                    item-text="name"
                    label="Бренд"
                    clearable
                )
            v-flex(xs6)
                v-combobox(
                    v-model="type"
                    :items="types"
                    item-value="id"
                    item-text="name"
                    label="Тип продукта"
                    clearable
                )
            v-flex(xs12)
                v-text-field(
                    v-model="query"
                    label="Поиск"
                )
            v-flex(xs12 v-if="products.length")
                .title Результаты: {{ products.length }}
                v-data-table(
                    :headers="headers"
                    :items="products"
                    :loading="loading"
                    hide-actions)
                    template(v-slot:items="props")
                        tr(@click="select(props.item)")
                            td {{ props.item.name }}
                            td {{ props.item.packing }}
                            td {{ props.item.color }}
</template>

<script>
/* eslint-disable no-param-reassign */
import Brand from '@/services/Brand';
import ProductType from '@/services/ProductType';
import Product from '@/services/Product';

export default {
  name: 'SearchProduct',
  data() {
    return {
      headers: [
        {
          text: 'Наименование',
          value: 'name',
        },
        {
          text: 'Фасовка',
          value: 'packing',
        },
        {
          text: 'Цвет',
          value: 'color',
        },
      ],
      loading: false,
      brand: null,
      brands: [],
      type: null,
      types: [],
      query: '',
      products: [],
      selected: [],
    };
  },
  methods: {
    getAll() {
      Promise.all([
        Brand.getAll(),
        ProductType.getAll(),
      ])
        .then((warehouse) => {
          [this.brands, this.types] = warehouse;
        });
    },
    search() {
      if (this.query || this.brand || this.type) {
        this.loading = true;
        Product.search(this.query,
          this.brand ? this.brand.id : null,
          this.type ? this.type.id : null)
          .then((products) => { this.products = products; })
          .finally(() => { this.loading = false; });
      } else {
        this.products = [];
      }
    },
    select(product) {
      const ids = this.selected.map(item => item.id);
      if (!ids.includes(product.id)) {
        product.quantity = 0;
        this.selected.push(product);
      }
    },
  },
  watch: {
    query() {
      this.search();
    },
    brand() {
      this.search();
    },
    type() {
      this.search();
    },
    selected(value) {
      this.$emit('input', value);
    },
  },
  created() {
    this.getAll();
  },
};
</script>

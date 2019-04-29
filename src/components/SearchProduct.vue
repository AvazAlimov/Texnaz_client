<template lang="pug">
    .border.white
        .title.pt-4.px-4 Поиск товаров
        v-layout(row wrap)
            v-flex(xs6).pl-4
                v-combobox(
                    v-model="brand"
                    :items="brands"
                    item-value="id"
                    item-text="name"
                    label="Бренд"
                    clearable
                    color="secondary"
                )
            v-flex(xs6).pr-4
                v-combobox(
                    v-model="type"
                    :items="types"
                    item-value="id"
                    item-text="name"
                    label="Тип продукта"
                    clearable
                    color="secondary"
                )
            v-flex(xs12).px-4.mb-3
                v-text-field(
                    v-model="query"
                    label="Поиск"
                    color="secondary"
                )
            v-flex(xs12 v-if="products.length")
                .title.px-4 Результаты: {{ products.length }}
                v-data-table(
                    :headers="headers"
                    :items="products"
                    :loading="loading"
                    hide-actions)
                    template(v-slot:items="props")
                        tr(
                          @click="select(props.item)"
                          :class="{'selectable': !contains(props.item.id)}"
                        )
                            td
                              v-icon(v-if="contains(props.item.id)" small) check
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
  props: {
    items: {
      // Items
      required: true,
    },
  },
  data() {
    return {
      headers: [
        {
          width: 50,
          sortable: false,
        },
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
      this.$emit('input', product);
    },
    contains(productId) {
      return this.items.find(item => item.product.id === productId);
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
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>
.selectable {
    cursor: pointer;
}
</style>

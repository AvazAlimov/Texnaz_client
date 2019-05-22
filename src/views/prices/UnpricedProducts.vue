<template lang="pug">
  .border.white
    v-data-table(
      :headers="headers"
      :items="products"
      :loading="loading"
      hide-actions)
      template(v-slot:items="props")
        tr(@click="props.expanded = !props.expanded")
          td {{ props.index + 1 }}
          td {{ props.item.Brand.name }} {{ props.item.name }}
          td.text-xs-center {{ props.item.packing }}
          td
            v-text-field(
              v-model="props.item.firstPrice"
              color="secondary"
              :name="props.item.id"
              v-validate="'required|decimal'"
            )
          td
            v-text-field(
              v-model="props.item.mixPriceNonCash"
              color="secondary"
              :name="props.item.id"
              v-validate="'required|decimal'"
            )
          td
            v-text-field(
              v-model="props.item.mixPriceCash"
              color="secondary"
              :name="props.item.id"
              v-validate="'required|decimal'"
            )
          td
            v-text-field(
              v-model="props.item.secondPrice"
              color="secondary"
              :name="props.item.id"
              v-validate="'required|decimal'"
            )
          td
            v-layout
              v-btn(
                icon flat
                :disabled="disabled(props.item)"
                color="secondary"
                @click="save(props.item)"
              )
                v-icon(small) save
</template>

<script>
/* eslint-disable no-param-reassign */
import Price from '@/services/Price';

export default {
  name: 'UnpricedProducts',
  data() {
    return {
      loading: false,
      headers: [
        {
          text: '#',
          value: 'index',
          sortable: false,
        },
        {
          text: 'Наименование',
          value: 'name',
        },
        {
          text: 'Фасовка',
          value: 'packing',
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
          width: 100,
          sortable: false,
        }],
      products: [],
    };
  },
  computed: {
    disabled() {
      return item => !!this.errors.first(`${item.id}`);
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      this.products = [];
      Price.getUnpricedProducts()
        .then((products) => {
          this.products = products;
          this.products.forEach((product) => {
            product.firstPrice = 0;
            product.mixPriceNonCash = 0;
            product.mixPriceCash = 0;
            product.secondPrice = 0;
          });
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    save(product) {
      this.loading = true;
      const index = this.products.indexOf(product);
      Price.createMultiple([{
        productId: product.id,
        firstPrice: product.firstPrice,
        mixPriceNonCash: product.mixPriceNonCash,
        mixPriceCash: product.mixPriceCash,
        secondPrice: product.secondPrice,
      }])
        .then(() => {
          this.products.splice(index, 1);
        })
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

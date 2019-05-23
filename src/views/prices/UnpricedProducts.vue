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
              @input="changed"
              color="secondary"
              :name="props.item.id"
              v-validate="'required|decimal|min_value:0|excluded:0'"
            )
          td
            v-text-field(
              v-model="props.item.mixPriceNonCash"
              @input="changed"
              color="secondary"
              :name="props.item.id"
              v-validate="'required|decimal|min_value:0|excluded:0'"
            )
          td
            v-text-field(
              v-model="props.item.mixPriceCash"
              @input="changed"
              color="secondary"
              :name="props.item.id"
              v-validate="'required|decimal|min_value:0|excluded:0'"
            )
          td
            v-text-field(
              v-model="props.item.secondPrice"
              @input="changed"
              color="secondary"
              :name="props.item.id"
              v-validate="'required|decimal|min_value:0|excluded:0'"
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
  methods: {
    getAll() {
      this.loading = true;
      this.products = [];
      Price.getUnpricedProducts()
        .then((products) => {
          products.forEach((product) => {
            product.firstPrice = '0';
            product.mixPriceNonCash = '0';
            product.mixPriceCash = '0';
            product.secondPrice = '0';
          });
          this.products = products;
          new Promise(resolve => setTimeout(resolve, 100)).then(() => {
            this.$validator.validate();
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
    disabled(item) {
      return !!this.errors.first(`${item.id}`);
    },
    changed() {
      new Promise(resolve => setTimeout(resolve, 100)).then(() => {
        this.$validator.validate();
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<template lang="pug">
  .border.white
    v-data-table(
      :headers="headers"
      :items="products"
      :loading="loading"
      :pagination.sync="pagination"
      hide-actions)
      template(v-slot:items="props")
        tr(@click="props.expanded = !props.expanded")
          td {{ props.index + 1 }}
          td {{ props.item.Brand.name }}
          td {{ props.item.Brand.manufacturer }}
          td {{ props.item.name }}
          td {{ props.item.packing }}
          td {{ props.item.color || '-' }}
          td
            v-text-field(
              v-model="props.item.mixPriceNonCash"
              @input="changed"
              color="secondary"
              :name="props.item.id"
              v-validate="'required|decimal|min_value:0|excluded:0'"
              style="min-width: 80px")
          td
            v-text-field(
              v-model="props.item.secondPrice"
              @input="changed"
              color="secondary"
              :name="props.item.id"
              v-validate="'required|decimal|min_value:0|excluded:0'"
              style="min-width: 80px")
          td {{ $b2c(props.item, officialRate, exchangeRate) | ceil }}
          td {{ $priceCash(props.item, exchangeRate) | roundUp }}
          td
            v-layout
              v-btn(
                icon flat
                :disabled="disabled(props.item)"
                color="secondary"
                @click="save(props.item)"
              )
                v-icon(small) save

    v-divider
    .text-xs-center.py-2
      v-pagination(v-model="pagination.page" color="secondary" :length="pageLength")
</template>

<script>
/* eslint-disable no-param-reassign */
import Price from '@/services/Price';
import Configuration from '@/services/Configuration';

export default {
  name: 'UnpricedProducts',
  data() {
    return {
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 30,
        totalItems: 0,
      },
      loading: false,
      exchangeRate: 1,
      officialRate: 1,
      headers: [
        {
          text: '#',
          value: 'index',
          sortable: false,
        },
        {
          text: 'Наименование',
          value: 'Brand.name',
        },
        {
          text: 'Наименование',
          value: 'Brand.manufacturer',
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
        {
          text: 'Наценка (сум)',
          sortable: false,
        },
        {
          text: 'B2B ($)',
          sortable: false,
        },
        {
          text: 'B2C (сум)',
          sortable: false,
        },
        {
          text: 'Наценка ($)',
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
    pageLength() {
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      this.products = [];
      Promise.all([
        Price.getUnpricedProducts(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
      ])
        .then((results) => {
          const [products] = results;
          this.exchangeRate = results[1].value;
          this.officialRate = results[2].value;
          products.forEach((product) => {
            product.firstPrice = '0';
            product.mixPriceNonCash = '0';
            product.mixPriceCash = '0';
            product.secondPrice = '0';
          });
          this.products = products;
          this.pagination.totalItems = products.length;
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

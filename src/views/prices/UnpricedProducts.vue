<template lang="pug">
  .border.white
    v-data-table(
      :headers="headers"
      :items="products"
      :loading="loading")
      template(v-slot:items="props")
        tr(@click="props.expanded = !props.expanded")
          td {{ props.index + 1 }}
          td {{ props.item.Brand.name }}
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
            v-menu(
              v-model="props.item.startMenu"
              full-width
              min-width="290px"
              :close-on-content-click="false"
            ).ma-2
              template(v-slot:activator="{ on }")
                  v-text-field(
                      readonly
                      v-model="props.item.startDate"
                      v-on="on"
                      label="От"
                  )
              v-date-picker(
                  v-model="props.item.startDate"
                  @input="() => { props.item.startMenu = false }"

              )
          td
            v-menu(
              v-model="props.item.endMenu"
              full-width
              min-width="290px"
              :close-on-content-click="false"
            ).ma-2
              template(v-slot:activator="{ on }")
                  v-text-field(
                      readonly
                      v-model="props.item.endDate"
                      v-on="on"
                      label="До"
                  )
              v-date-picker(
                  v-model="props.item.endDate"
                  @input="() => { props.item.endMenu = false }"

              )
          td
            v-select(
              v-model="props.item.warehouse"
              :items="warehouses"
              item-text="name"
              item-value="id"
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
import Configuration from '@/services/Configuration';
import Warehouse from '@/services/Warehouse';

export default {
  name: 'UnpricedProducts',
  data() {
    return {
      loading: false,
      exchangeRate: 1,
      officialRate: 1,
      warehouse: 1,
      warehouses: [],
      headers: [
        {
          text: '#',
          value: 'index',
          sortable: false,
        },
        {
          text: 'Бранд',
          value: 'Brand.name',
          width: 1,
        },
        {
          text: 'Наименование',
          value: 'name',
          width: 1,
        },
        {
          text: 'Фасовка',
          value: 'packing',
          width: 1,
        },
        {
          text: 'Цвет',
          value: 'color',
          width: 1,
        },
        {
          text: 'Наценка (сум)',
          sortable: false,
          width: 1,
        },
        {
          text: 'B2B ($)',
          sortable: false,
          width: 1,
        },
        {
          text: 'B2C (сум)',
          sortable: false,
          width: 1,
        },
        {
          text: 'Наценка ($)',
          sortable: false,
        },
        {
          text: 'Дата приема',
          sortable: false,
        },
        {
          text: 'Срок годности до',
          sortable: false,
        },
        {
          text: 'Склад',
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
      Promise.all([
        Price.getUnpricedProducts(),
        Warehouse.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
      ])
        .then((results) => {
          const [products, warehouses] = results;
          this.exchangeRate = results[2].value;
          this.officialRate = results[3].value;
          this.warehouses = warehouses;
          products.forEach((product) => {
            product.firstPrice = '0';
            product.mixPriceNonCash = '0';
            product.mixPriceCash = '0';
            product.secondPrice = '0';
            product.warehouse = 1;
            product.startMenu = false;
            product.endMenu = false;
            product.startDate = (new Date()).toISOString().substring(0, 10);
            product.endDate = (new Date()).toISOString().substring(0, 10);
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
      const stock = {
        warehouseId: product.warehouse,
        arrival_date: product.startDate,
        expiry_date: product.endDate,
        quantity: 0,
        productId: product.id,
        defected: false,
      };
      Price.createMultiple([{
        productId: product.id,
        firstPrice: product.firstPrice,
        mixPriceNonCash: product.mixPriceNonCash,
        mixPriceCash: product.mixPriceCash,
        secondPrice: product.secondPrice,
        userId: this.$getUserId(),
        stock,
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

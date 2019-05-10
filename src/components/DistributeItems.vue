<template lang="pug">
  v-dialog(v-model="dialog" scrollable persistent)
    template(v-slot:activator="{ on }")
      v-btn.mt-0.mb-1.ml-0.mr-0(flat color="secondary" v-on="on") Утвердить
    v-card
      v-card-title Распределение товаров
      v-divider
      v-card-text.pa-0
        v-data-table(
          :headers="headers"
          :items="products"
          no-data-text="Ничего не выбрано"
          fixed-headers
          hide-actions
        )
          template(v-slot:items="props")
            tr
              td {{ props.item.product.name }}
              td {{props.item.warehouses.reduce((a,b)=>parseFloat(a)+(parseFloat(b['quantity'])||0),0)}}
                |  / {{ props.item.quantity }}
              td(v-for="(warehouse, index) in props.item.warehouses" :key="index")
                v-text-field.ma-0(
                  v-model="warehouse.quantity"
                  placeholder="количество"
                  color="secondary"
                  :name="`количество ${props.item.product.id} ${index}`"
                  :error-messages="errors.first(`количество ${props.item.product.id} ${index}`)"
                  v-validate="'required|decimal'"
                )
      v-divider
      v-card-actions
        v-spacer
        v-btn.ma-0(
          flat
          color="secondary"
          @click="submit"
          :disabled="errors.items.length > 0"
        ) Утвердить
        v-btn.ma-0(
          flat
          color="secondary"
          @click="dialog = false"
        ) Отменить

</template>

<script>
import Warehouse from '@/services/Warehouse';
import PreStock from '@/services/PreStock';
import Batch from '@/services/Batch';
import Price from '@/services/Price';

export default {
  name: 'DistributeItems',
  props: {
    batch: {
      required: true,
    },
    items: {
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      products: [],
      warehouses: [],
    };
  },
  computed: {
    headers() {
      const columns = [
        {
          text: 'Наименование',
          value: 'product.name',
        },
        {
          text: 'Количество',
          value: 'quantity',
          sortable: false,
        },
      ];
      this.warehouses.forEach((warehouse) => {
        columns.push({
          text: `${warehouse.name} ${warehouse.company}`,
          value: warehouse.id,
          sortable: false,
        });
      });
      return columns;
    },
  },
  methods: {
    getAll() {
      Promise.all([
        Warehouse.getAll(),
      ]).then((results) => {
        [this.warehouses] = results;
        this.products = this.getProducts();
      });
    },
    getProducts() {
      const products = [];
      this.items.forEach((item) => {
        products.push({
          product: item.product,
          quantity: item.quantity,
          warehouses: this.warehouses.map(warehouse => ({
            id: warehouse.id,
            quantity: 0,
          })),
        });
      });
      return products;
    },
    submit() {
      const preStocks = [];
      this.products.forEach((item) => {
        item.warehouses.forEach((warehouse) => {
          if (warehouse.quantity > 0) {
            preStocks.push({
              productId: item.product.id,
              warehouseId: warehouse.id,
              quantity: warehouse.quantity,
            });
          }
        });
      });
      this.batch.approved = true;
      Promise.all([
        PreStock.createMultiple(preStocks),
        Batch.update(this.batch.id, this.batch),
        Price.createMultiple(this.items.map(item => ({
          productId: item.product.id,
          firstPrice: item.firstPrice,
          mixPriceNonCash: item.mixPriceNonCash,
          mixPriceCash: item.mixPriceCash,
          secondPrice: item.secondPrice,
        }))),
      ])
        .then(() => {
          this.$router.push({ name: 'calculator' });
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

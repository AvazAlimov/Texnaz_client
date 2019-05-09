<template lang="pug">
  v-layout(row wrap align-center)
    v-flex(xs12)
      Info(:batch="batch" :step="2")
      v-divider
      SearchProduct(v-model="product" :items="items")
      v-divider
      .white
        .title.pa-4 Выбранные товары: {{ items.length }}
        v-divider
        v-data-table(
          :headers="headers"
          :items="items"
          :headers-length="2"
          no-data-text="Ничего не выбрано"
          hide-actions)
          template(v-slot:items="props")
            SelectionItem(:item="props.item" :remove="remove")
      v-divider
      v-layout(align-center)
        v-spacer
        v-btn.mt-0.mb-1.mx-0(flat color="secondary"
          :disabled="errors.items.length > 0 || items.length == 0"
          :loading="loading"
          @click="submit") Завершить
</template>

<script>
/* eslint-disable no-param-reassign */
import Batch from '@/services/Batch';
import Item from '@/services/Item';

export default {
  name: 'Selection',
  data() {
    return {
      loading: false,
      product: null,
      items: [],
      batch: {
        expanses: [],
        items: [],
      },
      headers: [
        {
          text: 'Наименование',
          value: 'product.name',
        },
        {
          text: 'Фасовка',
          value: 'product.packing',
          align: 'center',
        },
        {
          text: 'Цвет',
          value: 'color',
          align: 'center',
          sortable: false,
        },
        {
          text: 'Количество',
          value: 'quantity',
          sortable: false,
          width: 200,
        },
        {
          text: 'Цена контрактная за фасовку ($)',
          value: 'contract_price',
          sortable: false,
        },
        {
          text: 'Цена таможенная за фасовку ($)',
          value: 'customs_price',
          sortable: false,
        },
        {
          text: 'Вес (кг)',
          value: 'weight',
          sortable: false,
        },
        {
          text: 'Цена контрактная за кг ($)',
          sortable: false,
        },
        {
          text: 'Цена таможенная за кг ($)',
          sortable: false,
        },
        {
          width: 100,
          sortable: false,
        },
      ],
    };
  },
  computed: {
    weight() {
      let sum = 0;
      this.items.forEach((item) => {
        sum += item.product.packing * (item.quantity || 0);
      });
      return sum || 0;
    },
  },
  methods: {
    getAll() {
      Promise.all([
        Batch.get(this.$route.params.id),
      ]).then((results) => {
        [this.batch] = results;
        this.batch.items.forEach((item) => {
          this.items.push(item);
        });
      });
    },
    remove(productId) {
      const item = this.items.find(element => element.productId === productId);
      this.items.splice(this.items.indexOf(item), 1);
    },
    submit() {
      this.loading = true;
      const tasks = [];
      const ids = [];
      this.items.forEach((item) => {
        if (!item.id) {
          tasks.push(Item.create(item));
        } else {
          ids.push(item.id);
          tasks.push(Item.update(item.id, item));
        }
      });
      this.batch.items.forEach((item) => {
        if (!ids.includes(item.id)) {
          tasks.push(Item.delete(item.id));
        }
      });
      Promise.all(tasks)
        .then(() => { this.$router.push({ name: 'customs_expanses' }); })
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
    },
  },
  watch: {
    product(product) {
      if (product) {
        const ids = this.items.map(item => item.product.id);
        if (!ids.includes(product.id)) {
          const item = {
            product,
            cash_profitability: 0,
            non_cash_profitability: 0,
            income_tax: 0,
            contract_price: 0,
            customs_price: 0,
            excise: product.excise,
            tax: product.tax,
            vat: product.vat,
            cleaning: product.cleaning,
            batchId: this.batch.id,
            productId: product.id,
          };
          this.items.push(item);
        }
      }
      this.product = null;
    },
  },
  created() {
    this.getAll();
  },
};
</script>

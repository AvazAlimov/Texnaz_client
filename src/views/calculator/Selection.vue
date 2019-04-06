<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'batch_expanses' }")
            v-icon arrow_back
        .title Выборка
        v-spacer
        .title 3/6

        v-flex.mt-3(xs12)
          Info(:batch="batch" :step="3")

        v-flex(xs12)
            SearchProduct(v-model="product")

        v-flex(xs12)
            .border.white
                .title.pa-4 Выбранные товары: {{ items.length }}
                v-divider
                v-data-table(
                    :headers="headers"
                    :items="items"
                    no-data-text="Ничего не выбрано"
                    hide-actions)
                    template(v-slot:items="props")
                        SelectionItem(:item="props.item" :remove="remove")

        v-flex(xs12)
            v-layout
                v-spacer
                v-btn.ma-2(flat color="primary"
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
          value: 'name',
          sortable: false,
        },
        {
          text: 'Фасовка',
          value: 'packing',
          sortable: false,
        },
        {
          text: 'Цвет',
          value: 'color',
          sortable: false,
        },
        {
          text: 'Количество',
          value: 'quantity',
          sortable: false,
        },
        {
          text: 'Вес',
          value: 'weight',
          sortable: false,
        },
        {
          width: 100,
          sortable: false,
        },
      ],
    };
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

<template lang="pug">
  v-layout.ma-2(row wrap)
    v-flex(xs12)
      Info(:batch="batch" :step="5")
    v-flex(xs12)
          .border.pa-4
            v-layout(wrap row justify-space-between)
              v-flex(xs3)
                v-text-field(v-model="incomeTax" label="Налог на прибыль %")
              v-flex(xs1)
                v-btn.mx-0.mt-3(
                  icon
                  @click="applyToAll('income_tax', incomeTax)"
                )
                  v-icon check
              v-flex(xs3)
                v-text-field(v-model="nonCashProfitability" label="Рентабельность (БН) %")
              v-flex(xs1)
                v-btn.mx-0.mt-3(
                  icon
                  @click="applyToAll('non_cash_profitability', nonCashProfitability)"
                )
                  v-icon check
              v-flex(xs3)
                v-text-field(v-model="cashProfitability" label="Рентабельность (Н) %")
              v-flex(xs1)
                v-btn.mx-0.mt-3(
                  icon
                  @click="applyToAll('cash_profitability', cashProfitability)"
                )
                  v-icon check
    v-flex(xs12)
      v-data-table.border(
        :headers="headers"
        :items="items"
        no-data-text="Ничего не выбрано"
        fixed-headers
        hide-actions)
        template(v-slot:items="props")
          PriceItem(:item="props.item" :batch="batch")
</template>

<script>
import Batch from '@/services/Batch';

export default {
  name: 'Price',
  data() {
    return {
      loading: false,
      batch: {
        expanses: [],
        items: [],
      },
      items: [],
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
      ],
      incomeTax: 0,
      cashProfitability: 0,
      nonCashProfitability: 0,
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
    applyToAll(name, value) {
      this.items.forEach((item) => {
        // eslint-disable-next-line no-param-reassign
        item[name] = value;
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

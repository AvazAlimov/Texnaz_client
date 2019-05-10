<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      Info(:batch="batch" :step="5")
      v-divider
      v-layout.pt-3(wrap row)
        v-text-field.mx-4(
          v-model="incomeTax"
          label="Налог на прибыль %"
          @input="applyToAll('income_tax', incomeTax)"
          color="secondary"
        )
        v-text-field.mx-4(
          v-model="nonCashProfitability"
          label="Рентабельность (БН) %"
          @input="applyToAll('non_cash_profitability', nonCashProfitability)"
          color="secondary"
        )
        v-text-field.mx-4(
          v-model="cashProfitability"
          label="Рентабельность (Н) %"
          @input="applyToAll('cash_profitability', cashProfitability)"
          color="secondary"
        )
      v-divider
      v-data-table(
        :headers="headers"
        :items="items"
        no-data-text="Ничего не выбрано"
        fixed-headers
        hide-actions)
        template(v-slot:items="props")
          PriceItem(:item="props.item" :batch="batch")
      v-divider
      v-layout(wrap row justify-end)
        DistributeItems(
          v-if="items.length"
          :batch="batch"
          :items="items"
        )
        //v-btn.mt-0.mb-1.ml-0.mr-0(flat color="secondary") Сохранить
        v-btn.mt-0.mb-1.ml-0.mr-1(flat color="secondary" @click="print") Распечатать
</template>

<script>
import Batch from '@/services/Batch';
import Export from '@/utils/Export';

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
          text: 'Количество',
          value: 'quantity',
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
    print() {
      const jsonData = this.items.map(item => ({
        name: item.product.name,
        packing: item.product.packing,
        firstPrice: item.firstPrice,
        mixPriceNonCash: item.mixPriceNonCash,
        mixPriceCash: item.mixPriceCash,
        secondPrice: item.secondPrice,
      }));
      Export.priceToExcel(jsonData, 'Цены');
    },
  },
  created() {
    this.getAll();
  },
};
</script>

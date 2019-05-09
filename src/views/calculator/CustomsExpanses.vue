<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
          Info(:batch="batch" :step="4")
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
              hide-actions)
              template(v-slot:items="props")
                  CustomsItem(:item="props.item" :batch="batch")
          v-divider
          v-layout
            v-spacer
            v-btn.mt-0.mb-1.mx-0(flat color="secondary"
              :loading="loading"
              :disabled="errors.items.length > 0"
              @click="submit") Завершить
</template>

<script>
import Batch from '@/services/Batch';
import Item from '@/services/Item';

export default {
  name: 'CustomsExpanses',
  data() {
    return {
      loading: false,
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
          text: 'Акциз %',
          value: 'excise',
          sortable: false,
        },
        {
          text: 'Пошлина %',
          value: 'tax',
          sortable: false,
        },
        {
          text: 'НДС %',
          value: 'vat',
          sortable: false,
        },
        {
          text: 'Очистка %',
          value: 'cleaning',
          sortable: false,
        },
        {
          text: 'Себестоимость БН',
          value: 'cost_price_non_cash',
          sortable: false,
        },
        {
          text: 'Рентабельность (БН) %',
          value: 'profitability_non_cash',
          sortable: false,
        },
        {
          text: 'Налог на прибыль %',
          value: 'income_tax',
          sortable: false,
        },
        {
          text: 'Цена БН для списания',
          value: 'charge_price',
          sortable: false,
        },
        {
          text: 'Рентабельность (Н) %',
          value: 'profitability_cash',
          sortable: false,
        },
        {
          text: 'Цена Н для расчетов',
          value: 'charge_price',
          sortable: false,
        },
      ],
      items: [],
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
    submit() {
      this.loading = true;
      const tasks = [];
      this.items.forEach((item) => {
        tasks.push(Item.update(item.id, item));
      });
      Promise.all(tasks)
        .then(() => { this.$router.push({ name: 'price' }); })
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
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

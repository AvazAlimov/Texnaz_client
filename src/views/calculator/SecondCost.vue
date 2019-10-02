<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'first_cost' }")
            v-icon arrow_back
        .title Остаточная себестоимость
        v-spacer
        .title 6/6

        v-flex.mt-3(xs12)
          Info(:batch="batch" :step="6")

        v-flex(xs12)
            .border.white
                .title.pa-4 Товары
                v-data-table(
                    :headers="headers"
                    :items="items"
                    no-data-text="Ничего не выбрано"
                    hide-actions)
                    template(v-slot:items="props")
                        SecondCostItem(:item="props.item" :batch="batch")

        v-flex(xs12)
            v-layout
                v-spacer
                v-btn.ma-2(flat color="primary"
                  :loading="loading"
                  :disabled="errors.items.length > 0"
                  @click="submit") Завершить
</template>

<script>
import Batch from '@/services/Batch';
import Item from '@/services/Item';

export default {
  name: 'SecondCost',
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
        },
        {
          text: 'Цвет',
          value: 'color',
          sortable: false,
        },
        {
          text: 'Себестоимость Н за кг',
          value: 'cost_price_non_cash',
          sortable: false,
        },
        {
          text: 'Транспорт Н',
          value: 'expanses',
          sortable: false,
        },
        {
          text: 'Расходы Н',
          value: 'period_expanses',
          sortable: false,
        },
        {
          text: 'Затраты на поставку Н',
          value: 'period_expanses',
          sortable: false,
        },
        {
          text: 'Рентабельность %',
          value: 'profitability_cash',
          sortable: false,
        },
        {
          text: 'Рентабельность',
          value: 'profitability',
          sortable: false,
        },
        {
          text: 'Цена Н для расчетов',
          value: 'charge_price',
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
  },
  created() {
    this.getAll();
  },
};
</script>

<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12).mb-3
            .title УТВЕРЖДЕНИЕ
        v-flex(xs6)
            .border.pa-4
                v-text-field(v-model="total" label="Общий оборот")
                v-text-field(v-model="convert" label="Конвертация")
                v-text-field(v-model="bank_transfer" label="Банковский перевод")
        v-flex(xs6)
            .border.pa-4
                v-text-field(v-model="market" label="Курс доллара (рыночный)")
                v-text-field(v-model="official" label="Курс доллара (официальный)")
                v-text-field(v-model="exchange" label="Курс доллара (обмен)")
        v-flex(xs6)
            .border
                .title.ma-4 Расходы периода (н)
                v-data-table(:headers="headers" :items="cash" hide-actions)
                    template(v-slot:items="props")
                            td {{ props.item.name }}
                            td
                                v-text-field(v-model="props.item.value")
                v-divider
                v-btn(block flat).ma-0 Добавить
                v-divider
                .ma-4
                  .subheading Всего: {{totalCash}}
                  .subheading Коэффициент:
                    |  {{ (totalCash / total) > 2 ? (totalCash / total).toFixed(2) : 2}}%

        v-flex(xs6)
            .border
                .title.ma-4 Расходы периода (бн)
                v-data-table(:headers="headers" :items="non_cash" hide-actions)
                    template(v-slot:items="props")
                            td {{ props.item.name }}
                            td
                                v-text-field(v-model="props.item.value")
                v-divider
                v-btn(block flat).ma-0 Добавить
                v-divider
                .ma-4
                  .subheading Всего: {{totalNonCash}}
                  .subheading Коэффициент:
                      |  {{ (totalNonCash / total) > 4 ? (totalNonCash / total).toFixed(2) : 4}}%
</template>

<script>
import Expanse from '@/services/Expanse';

export default {
  name: 'StepOne',
  data() {
    return {
      headers: [{
        text: 'Название',
        value: 'name',
        sortable: false,
      }, {
        text: 'Значение',
        value: 'value',
        sortable: false,
      }],
      cash: [],
      non_cash: [],
      total: 33000000,
      convert: 0.5,
      bank_transfer: 2,
      market: 8453,
      official: 8350,
      exchange: 8380,
    };
  },
  computed: {
    totalCash() {
      let total = 0;
      this.cash.forEach((cash) => { total += parseFloat(cash.value); });
      return total;
    },
    totalNonCash() {
      let total = 0;
      this.non_cash.forEach((cash) => { total += parseFloat(cash.value); });
      return total;
    },
  },
  methods: {
    getAll() {
      Promise.all([
        Expanse.getAll(),
      ]).then((results) => {
        const [expanses] = results;
        expanses.forEach((expanse) => {
          if (!expanse.is_transport) {
            if (expanse.is_cash) this.cash.push(expanse);
            else this.non_cash.push(expanse);
          }
        });
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style>

</style>

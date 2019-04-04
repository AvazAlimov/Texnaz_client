<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'approvement' }")
            v-icon arrow_back
        .title Расходы по растаможке
        v-flex(xs12)
        v-flex(xs6)
            .border.pa-4.white
                .subheading.mb-1
                    strong Название партии:
                    |  {{ batch.name }}
                .subheading.mb-1
                    strong Номер партии:
                    |  {{ batch.number }}
                .subheading.mb-1
                    strong Дата прибытия:
                    |  {{ batch.date ? batch.date.substring(0, 10) : '-' }}
                .subheading.mb-1
                    strong Транспорт (Н):
                    |  {{ batch.transport_cash }} $
                .subheading.mb-1
                    strong Транспорт (БН):
                    |  {{ batch.transport_non_cash }} $
                .subheading.mb-1
                    strong Склад:
                    |  {{ batch.Warehouse ? batch.Warehouse.name : '-' }}
        v-flex(xs6)
            .border.pa-4.white
                .subheading.mb-1
                    strong Общий оборот:
                    |  {{ batch.total }}
                .subheading.mb-1
                    strong Конвертация:
                    |  {{ batch.conversion }} %
                .subheading.mb-1
                    strong Банковский перевод:
                    |  {{ batch.bank_transfer }} %
                .subheading.mb-1
                    strong Курс доллара (рыночный):
                    |  {{ batch.market_rate }}
                .subheading.mb-1
                    strong Курс доллара (официальный):
                    |  {{ batch.official_rate }}
                .subheading.mb-1
                    strong Курс доллара (обмен):
                    |  {{ batch.exchange_rate }}
</template>

<script>
import Batch from '@/services/Batch';

export default {
  name: 'CustomsExpanses',
  data() {
    return {
      batch: {},
    };
  },
  methods: {
    getAll() {
      Promise.all([
        Batch.get(this.$route.params.id),
      ]).then((results) => {
        [this.batch] = results;
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

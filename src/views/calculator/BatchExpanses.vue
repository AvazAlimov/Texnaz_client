<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'batch_info' }")
            v-icon arrow_back
        .title Расходы по партии
        v-layout.mt-2(row wrap)
            v-flex(xs6 d-flex)
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
            v-flex(xs6 d-flex)
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
                    v-divider.my-2
                    .subheading.mb-1
                        strong Расходы периода (н):
                        |  {{ cash_expanses_rate }} %
                    .subheading.mb-1
                        strong Расходы периода (бн):
                        |  {{ non_cash_expanses_rate }} %
            v-flex(xs6)
                Expanses(
                    v-model="cash_expanses"
                    title="Затраты на поставку (н)"
                    :total="batch.market_rate"
                    :is_transport="true"
                    :is_cash="true"
                    :batchId="$route.params.id")
            v-flex(xs6)
                Expanses(
                    v-model="non_cash_expanses"
                    title="Затраты на поставку (бн)"
                    :total="batch.official_rate"
                    :is_transport="true"
                    :is_cash="false"
                    :batchId="$route.params.id")
            v-flex(xs12)
                v-layout
                    v-spacer
                    v-btn.ma-2(flat color="primary" :loading="loading" @click="submit") Подтвердить
</template>

<script>
import Batch from '@/services/Batch';
import BatchExpanse from '@/services/BatchExpanse';

export default {
  name: 'BatchExpanses',
  data() {
    return {
      loading: false,
      batch: {
        expanses: [],
      },
      cash_expanses: [],
      non_cash_expanses: [],
    };
  },
  computed: {
    cash_expanses_rate() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (!expanse.is_transport && expanse.is_cash) sum += expanse.value;
      });
      return (sum / this.batch.total) * 100 > 2 ? ((sum / this.batch.total) * 100).toFixed(2) : 2;
    },
    non_cash_expanses_rate() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (!expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return (sum / this.batch.total) * 100 > 4 ? ((sum / this.batch.total) * 100).toFixed(2) : 4;
    },
  },
  methods: {
    getAll() {
      Promise.all([
        Batch.get(this.$route.params.id),
      ]).then((results) => {
        [this.batch] = results;
      });
    },

    submit() {
      this.loading = true;
      const tasks = [];
      const expanseIds = [];
      this.cash_expanses.forEach((expanse) => {
        if (expanse.id) {
          expanseIds.push(expanse.id);
          tasks.push(BatchExpanse.update(expanse.id, expanse));
        } else tasks.push(BatchExpanse.create(expanse));
      });
      this.non_cash_expanses.forEach((expanse) => {
        if (expanse.id) {
          expanseIds.push(expanse.id);
          tasks.push(BatchExpanse.update(expanse.id, expanse));
        } else tasks.push(BatchExpanse.create(expanse));
      });
      this.batch.expanses.forEach((expanse) => {
        if (!expanseIds.includes(expanse.id) && expanse.is_transport) {
          tasks.push(BatchExpanse.delete(expanse.id));
        }
      });
      Promise.all(tasks)
        .then(() => { this.$router.push({ name: 'customs_expanses' }); })
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

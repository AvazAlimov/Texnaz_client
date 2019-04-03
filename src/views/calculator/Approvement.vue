<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12).mb-3
            .title УТВЕРЖДЕНИЕ
        v-flex(xs6)
            .border.pa-4.white
                v-text-field(v-model="batch.total" label="Общий оборот")
                v-text-field(v-model="batch.conversion" label="Конвертация")
                v-text-field(v-model="batch.bank_transfer" label="Банковский перевод")
        v-flex(xs6)
            .border.pa-4.white
                v-text-field(v-model="batch.market_rate" label="Курс доллара (рыночный)")
                v-text-field(v-model="batch.official_rate" label="Курс доллара (официальный)")
                v-text-field(v-model="batch.exchange_rate" label="Курс доллара (обмен)")
        v-flex(xs6)
          Expanses(
            v-model="cash_expanses"
            title="Расходы периода (н)"
            :total="batch.total"
            :is_transport="false"
            :is_cash="true"
            :batchId="$route.params.id")
        v-flex(xs6)
          Expanses(
            v-model="non_cash_expanses"
            title="Расходы периода (бн)"
            :total="batch.total"
            :is_transport="false"
            :is_cash="false"
            :batchId="$route.params.id")
        v-flex(xs12)
            v-layout
                v-spacer
                v-btn.ma-2(flat color="primary" @click="submit") Утвердить

</template>

<script>
import Batch from '@/services/Batch';
import BatchExpanse from '@/services/BatchExpanse';

export default {
  name: 'Approvement',
  data() {
    return {
      loading: false,
      batch: {
        total: 0,
        conversion: 0,
        bank_transfer: 0,
        market_rate: 0,
        official_rate: 0,
        exchange_rate: 0,
      },
      cash_expanses: [],
      non_cash_expanses: [],
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

    submit() {
      this.loading = true;
      const tasks = [];
      const expanseIds = [];
      tasks.push(Batch.update(this.batch.id, this.batch));
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
        if (!expanseIds.includes(expanse.id)) {
          tasks.push(BatchExpanse.delete(expanse.id));
        }
      });
      Promise.all(tasks)
        .then(() => {})
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

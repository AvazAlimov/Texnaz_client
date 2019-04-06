<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'batch_info' }")
            v-icon arrow_back
        .title Расходы по партии
        v-spacer
        .title 2/6

        v-flex.mt-3(xs12)
          Info(:batch="batch" :step="2")

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
        items: [],
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
        .then(() => { this.$router.push({ name: 'selection' }); })
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

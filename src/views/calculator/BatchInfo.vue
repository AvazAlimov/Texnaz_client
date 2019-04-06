<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'calculator' }")
            v-icon arrow_back
        .title Информация о партии
        v-spacer
        .title 1/6
        v-flex(xs12)
        v-layout(row wrap)
          v-flex(xs6)
              .border.pa-4.white
                .title Информация о партии
                v-text-field(v-model="batch.name" label="Название партии")
                v-text-field(v-model="batch.number" label="Номер партии")
                v-text-field(v-model="batch.date" label="Дата прибытия")
                v-text-field(v-model="batch.transport_cash" label="Транспорт (Н)")
                v-text-field(v-model="batch.transport_non_cash" label="Транспорт (БН)")
                v-select(
                      v-model="batch.warehouse"
                      :items="warehouses"
                      item-text="name"
                      item-value="id"
                      label="Склад")
                v-checkbox(v-model="batch.local" label="Импорт")
          v-flex(xs6 d-flex)
              .border.pa-4.white
                  v-text-field(v-model="batch.total" label="Общий оборот")
                  v-text-field(v-model="batch.conversion" label="Конвертация")
                  v-text-field(v-model="batch.bank_transfer" label="Банковский перевод")
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
                  v-btn.ma-2(flat color="primary" :loading="loading" @click="submit") Подтвердить

</template>

<script>
import Batch from '@/services/Batch';
import Warehouse from '@/services/Warehouse';
import BatchExpanse from '@/services/BatchExpanse';

export default {
  name: 'BatchInfo',
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
      warehouses: [],
      cash_expanses: [],
      non_cash_expanses: [],
    };
  },
  methods: {
    getAll() {
      Promise.all([
        Batch.get(this.$route.params.id),
        Warehouse.getAll(),
      ]).then((results) => {
        [this.batch, this.warehouses] = results;
        this.batch.date = this.batch.date.substring(0, 10);
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
        if (!expanseIds.includes(expanse.id) && !expanse.is_transport) {
          tasks.push(BatchExpanse.delete(expanse.id));
        }
      });
      Promise.all(tasks)
        .then(() => { this.$router.push({ name: 'batch_expanses' }); })
        .catch((error) => { this.$store.commit('setMessage', error.message); })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

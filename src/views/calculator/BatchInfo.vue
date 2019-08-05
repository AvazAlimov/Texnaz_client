<template lang="pug">
  v-layout.ma-2(row wrap)
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
          v-checkbox(v-model="batch.local" label="Местный")
    v-flex(xs6 d-flex)
        .border.pa-4.white
            .title Финансовые показатели
            v-text-field(v-model="batch.total" label="Общий оборот")
            v-text-field(v-model="batch.conversion" label="Конвертация")
            v-text-field(v-model="batch.bank_transfer" label="Банковский перевод")
            v-text-field(v-model="batch.market_rate" label="Курс доллара (Покупка)")
            v-text-field(v-model="batch.official_rate" label="Курс доллара (Покупка)")
    v-flex(xs6 d-flex)
      Expanses(
        v-model="period_cash_expanses"
        title="Расходы периода (н)"
        :total="batch.total"
        :is_transport="false"
        :is_cash="true"
        :batchId="$route.params.id")
    v-flex(xs6 d-flex)
      Expanses(
        v-model="period_non_cash_expanses"
        title="Расходы периода (бн)"
        :total="batch.total"
        :is_transport="false"
        :is_cash="false"
        :batchId="$route.params.id")
    v-flex(xs6 d-flex)
      Expanses(
        v-model="delivery_cash_expanses"
        title="Затраты на поставку (н)"
        :total="batch.market_rate"
        :is_transport="true"
        :is_cash="true"
        :batchId="$route.params.id")
    v-flex(xs6 d-flex)
      Expanses(
        v-model="delivery_non_cash_expanses"
        title="Затраты на поставку (бн)"
        :total="batch.official_rate"
        :is_transport="true"
        :is_cash="false"
        :batchId="$route.params.id")
    v-flex(xs12)
        v-layout
            v-spacer
            v-btn.ma-2(flat color="secondary"
              :disabled="errors.items.length > 0"
              :loading="loading" @click="submit") Подтвердить
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
      period_cash_expanses: [],
      period_non_cash_expanses: [],
      delivery_cash_expanses: [],
      delivery_non_cash_expanses: [],
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

      this.period_cash_expanses.forEach((expanse) => {
        if (expanse.id) {
          expanseIds.push(expanse.id);
          tasks.push(BatchExpanse.update(expanse.id, expanse));
        } else tasks.push(BatchExpanse.create(expanse));
      });
      this.period_non_cash_expanses.forEach((expanse) => {
        if (expanse.id) {
          expanseIds.push(expanse.id);
          tasks.push(BatchExpanse.update(expanse.id, expanse));
        } else tasks.push(BatchExpanse.create(expanse));
      });
      this.delivery_cash_expanses.forEach((expanse) => {
        if (expanse.id) {
          expanseIds.push(expanse.id);
          tasks.push(BatchExpanse.update(expanse.id, expanse));
        } else tasks.push(BatchExpanse.create(expanse));
      });
      this.delivery_non_cash_expanses.forEach((expanse) => {
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

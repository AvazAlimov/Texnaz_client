<template lang="pug">
    v-layout(row wrap)
        v-flex(xs6 d-flex)
            .border.pa-4.white
                v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Название партии
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.name }}
                v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Номер партии
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.number }}
                v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Дата прибытия
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.date ? batch.date.substring(0, 10) : '-' }}
                v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Склад
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.Warehouse ? batch.Warehouse.name : '-' }}
        v-flex(xs6 d-flex)
            .border.pa-4.white
              v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Общий оборот
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.total }} сум
              v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Транспорт (Н)
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.transport_cash }} $
              v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Транспорт (БН)
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.transport_non_cash }} $
              v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Конвертация
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.conversion }} %
              v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Банковский перевод
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.bank_transfer }} %
              v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Курс доллара (рыночный)
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.market_rate }} сум
              v-layout.mb-1(align-center)
                  .subheading.font-weight-bold Курс доллара (официальный)
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ batch.official_rate }} сум
              v-layout.mb-1(align-center v-if="step > 2")
                  .subheading.font-weight-bold Расходы периода (н)
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ cash_expanses_rate }} %
              v-layout.mb-1(align-center v-if="step > 2")
                  .subheading.font-weight-bold Расходы периода (бн)
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ non_cash_expanses_rate }} %
              v-layout.mb-1(align-center v-if="step > 2")
                  .subheading.font-weight-bold Затраты на поставку (н)
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ transport_cash_expanses_rate }}
              v-layout.mb-1(align-center v-if="step > 2")
                  .subheading.font-weight-bold Затраты на поставку (бн)
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ transport_non_cash_expanses_rate }}
              v-layout.mb-1(align-center v-if="step > 3")
                  .subheading.font-weight-bold Транспорт БН за кг
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ (batch.transport_non_cash / totalWeight).toFixed(2) }}
              v-layout.mb-1(align-center v-if="step > 3")
                  .subheading.font-weight-bold Транспорт Б за кг
                  v-spacer
                    v-divider.mx-4
                  .subheading {{ (batch.transport_cash / totalWeight).toFixed(2) }}
</template>

<script>
export default {
  name: 'Info',
  props: {
    batch: {
      required: true,
    },
    step: {
      required: true,
    },
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
    transport_cash_expanses_rate() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (expanse.is_transport && expanse.is_cash) sum += expanse.value;
      });
      return (sum / this.batch.market_rate).toFixed(2);
    },
    transport_non_cash_expanses_rate() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return (sum / this.batch.official_rate).toFixed(2);
    },
    totalWeight() {
      let sum = 0;
      this.batch.items.forEach((element) => {
        sum += element.product.packing * element.quantity;
      });
      return sum;
    },
  },
};
</script>

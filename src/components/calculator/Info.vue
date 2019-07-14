<template lang="pug">
  v-expansion-panel(v-model="panel")
    v-expansion-panel-content
      template(v-slot:header)
        .title Информация о партии
      v-layout(row wrap).mx-3.mb-3
        v-flex(xs6)
          .pa-2.white
            v-layout.mb-1(align-center)
              .subheading Название партии
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.name }}
            v-layout.mb-1(align-center)
              .subheading Номер партии
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.number }}
            v-layout.mb-1(align-center)
              .subheading Дата прибытия
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.date ? batch.date.substring(0, 10) : '-' }}
            v-layout.mb-1(align-center)
              .subheading Склад
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.Warehouse ? batch.Warehouse.name : '-' }}
            v-layout.mt-3.mb-3(align-center v-if="step > 2")
              .title Расходы на партию
            v-layout.mb-1(align-center v-if="step > 2")
              .subheading Расчет конвертации
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.conversion | ceil | readable}} сум
            v-layout.mb-1(align-center v-if="step > 2")
              .subheading Затраты на банк
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.bankTransfer | ceil | readable}} сум
            v-layout.mb-1(align-center v-if="step > 2")
              .subheading НДС
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.totalVat | roundUp | readable}} $
            v-layout.mb-1(align-center v-if="step > 2")
              .subheading Пошлина
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.totalTax | roundUp | readable}} $
            v-layout.mb-1(align-center v-if="step > 2")
              .subheading Акциз
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.totalExcise | roundUp | readable}} $
            v-layout.mb-1(align-center v-if="step > 2")
              .subheading Очистка
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.totalCleaning | roundUp | readable}} $
            v-layout(align-center v-if="step > 2")
              .subheading Итого
              v-spacer
                v-divider.mx-4
              .subheading {{ totalExpense | roundUp | readable}} $
        v-flex(xs6)
          .pa-2.white
            v-layout.mb-1(align-center)
              .subheading Общий оборот
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.total }} сум
            v-layout.mb-1(align-center)
              .subheading Конвертация
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.conversion }} %
            v-layout.mb-1(align-center)
              .subheading Банковский перевод
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.bank_transfer }} %
            v-layout.mb-1(align-center)
              .subheading Курс доллара (обмен)
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.market_rate }} сум
            v-layout.mb-1(align-center)
              .subheading Курс доллара (официальный)
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.official_rate }} сум
            v-layout.mb-1(align-center)
              .subheading Транспорт (н)
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.transport_cash }} $
            v-layout.mb-1(align-center)
              .subheading Транспорт (бн)
              v-spacer
                v-divider.mx-4
              .subheading {{ batch.transport_non_cash }} $
            v-layout.mb-1(align-center v-if="step > 1")
              .subheading Расходы периода (н)
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.periodExpansesCash | roundUp }} %
            v-layout.mb-1(align-center v-if="step > 1")
              .subheading Расходы периода (бн)
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.periodExpansesNonCash | roundUp }} %
            v-layout.mb-1(align-center v-if="step > 1")
              .subheading Затраты на поставку (н)
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.transportExpansesCash | roundUp }} $
            v-layout.mb-1(align-center v-if="step > 1")
              .subheading Затраты на поставку (бн)
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.transportExpansesNonCash | roundUp }} $
            v-layout.mb-1(align-center v-if="step > 2")
              .subheading Транспорт БН за кг
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.transportExpansesPerUnitNonCash | roundUp }} $/кг
            v-layout.mb-1(align-center v-if="step > 2")
              .subheading Транспорт Н за кг
              v-spacer
                v-divider.mx-4
              .subheading {{ formedBatch.transportExpansesPerUnitCash | roundUp }} $/кг
            v-layout.mb-1(align-center v-if="step > 2")
              .subheading Общий вес
              v-spacer
                v-divider.mx-4
              .subheading {{ totalWeight | roundUp }} кг
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
  data() {
    return {
      panel: [true],
    };
  },
  computed: {
    formedBatch() {
      return this.$batch(this.batch);
    },
    totalExpense() {
      return this.formedBatch.totalVat
            + this.formedBatch.totalTax
            + this.formedBatch.totalExcise
            + this.formedBatch.totalCleaning;
    },
    // Общий вес
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
<style>
.v-expansion-panel {
    box-shadow: none;
}
</style>

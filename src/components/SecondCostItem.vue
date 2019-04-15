<template lang="pug">
    tr
      td {{ item.product.name }}
      td {{ item.product.packing }}
      td {{ item.product.color }}
      td {{ costPriceCash | roundUp }}
      td {{ transport_expanses_per_unit_cash.toFixed(2) }}
      td {{ period_expanses_cash_per_unit.toFixed(2) }}
      td {{ transport_expanses_cash.toFixed(2) }}
      td
        v-text-field(v-model="item.non_cash_profitability"
          name="profitability"
          v-validate="'required|between:0,100'")
      td {{ profitabilityValue.toFixed(2) }}
      td {{ secondCost | roundUp }}
</template>

<script>
/* eslint-disable no-param-reassign */
export default {
  name: 'Item',
  props: {
    item: {
      required: true,
    },
    batch: {
      required: true,
    },
  },
  computed: {
    // Общий вес
    totalWeight() {
      let sum = 0;
      this.batch.items.forEach((element) => {
        sum += element.product.packing * element.quantity;
      });
      return sum;
    },
    // Транспорт Н за кг
    transport_expanses_per_unit_cash() {
      return this.batch.transport_cash / this.totalWeight;
    },
    // Расходы периода (н)
    period_expanses_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (!expanse.is_transport && expanse.is_cash) sum += expanse.value;
      });
      return ((sum / this.batch.total) * 100) > 2 ? ((sum / this.batch.total) * 100) : 2;
    },
    // Затраты на поставку (н)
    transport_expanses_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (expanse.is_transport && expanse.is_cash) sum += expanse.value;
      });
      return sum / this.batch.market_rate / this.totalWeight;
    },
    // Себестоимость Н
    costPriceCash() {
      return (this.item.contract_price
              - this.item.customs_price)
              / this.item.product.packing;
    },
    period_expanses_cash_per_unit() {
      return (this.costPriceCash
              + this.transport_expanses_per_unit_cash)
              * (this.period_expanses_cash / 100);
    },
    // Рентабельность
    profitabilityValue() {
      return (this.costPriceCash
              + this.transport_expanses_per_unit_cash
              + this.period_expanses_cash_per_unit)
              * (parseFloat(this.item.non_cash_profitability) / 100);
    },
    // Цена Н для расчетов
    secondCost() {
      return this.costPriceCash
              + this.period_expanses_cash_per_unit
              + this.transport_expanses_per_unit_cash
              + this.transport_expanses_cash
              + this.profitabilityValue;
    },
  },
};
</script>

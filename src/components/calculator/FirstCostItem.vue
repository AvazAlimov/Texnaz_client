<template lang="pug">
    tr
      td {{ item.product.name }}
      td {{ item.product.packing }}
      td {{ item.product.color }}
      td {{ costPriceNonCash | roundUp }}
      td {{ transport_expanses_non_cash.toFixed(2) }}
      td {{ period_expanses_non_cash_per_unit.toFixed(2) }}
      td
        v-text-field(v-model="item.cash_profitability"
          name="profitability"
          v-validate="'required|between:0,100'")
      td {{ profitabilityValue.toFixed(2) }}
      td
        v-text-field(v-model="item.income_tax"
          name="income_tax"
          v-validate="'required|between:0,100'")
      td {{ incomeTaxValue.toFixed(2) }}
      td {{ firstCost | roundUp }}
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
    weight() {
      const value = this.item.product.packing * parseFloat(this.item.quantity || 0);
      return this.roundUp(value, 2);
    },
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
    // Транспорт БН за кг
    transport_expanses_per_unit_non_cash() {
      return this.batch.transport_non_cash / this.totalWeight;
    },
    // Размер акциза
    exciseValue() {
      return parseFloat(this.item.customs_price)
              / this.item.product.packing
              * (this.item.excise / 100);
    },
    // Размер пошлины
    taxValue() {
      return parseFloat(this.item.customs_price)
              / this.item.product.packing
              * (this.item.tax / 100);
    },
    // Размер НДС
    vatValue() {
      return (parseFloat(this.item.customs_price)
              / this.item.product.packing
              + this.exciseValue
              + this.taxValue
              + this.transport_expanses_per_unit_non_cash)
              * (this.item.vat / 100);
    },
    // Размер очистки
    cleaningValue() {
      return (parseFloat(this.item.customs_price)
              / this.item.product.packing
              + this.exciseValue
              + this.taxValue
              + this.transport_expanses_per_unit_non_cash)
              * (this.item.cleaning / 100);
    },
    // Себестоимость БН
    costPriceNonCash() {
      return (this.transport_expanses_per_unit_non_cash
              + parseFloat(this.item.customs_price)
              / this.item.product.packing
              + this.exciseValue
              + this.taxValue
              + this.cleaningValue);
    },
    // Расходы периода (бн)
    period_expanses_non_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (!expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return ((sum / this.batch.total) * 100) > 4 ? ((sum / this.batch.total) * 100) : 4;
    },
    period_expanses_non_cash_per_unit() {
      return (this.costPriceNonCash
              + this.transport_expanses_non_cash)
              * (this.period_expanses_non_cash / 100);
    },
    // Затраты на поставку (бн)
    transport_expanses_non_cash() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return sum / this.batch.official_rate / this.totalWeight;
    },
    // Размер рентабельности (бн)
    profitabilityValue() {
      return (this.costPriceNonCash // Себестоимость БН
              + this.transport_expanses_non_cash
              + this.period_expanses_non_cash_per_unit)// Затраты на поставку (бн)
              * (parseFloat(this.item.cash_profitability) / 100);
    },
    // Размер налога на прибыль
    incomeTaxValue() {
      return parseFloat(this.profitabilityValue * this.item.income_tax / 100);
    },
    // Цена БН для списания
    firstCost() {
      return (this.costPriceNonCash
                    + this.transport_expanses_non_cash
                    + this.period_expanses_non_cash_per_unit
                    + this.profitabilityValue
                    + this.incomeTaxValue)
                    * (1 + this.item.vat / 100);
    },
  },
  methods: {
    roundUp(num, precision) {
      precision = 10 ** precision;
      return Math.ceil(num * precision) / precision;
    },
  },
};
</script>

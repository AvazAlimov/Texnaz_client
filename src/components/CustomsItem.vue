<template lang="pug">
    tr
      td {{ item.product.name }}
      td.text-xs-center {{ item.product.packing }}
      td.text-xs-center {{ item.product.color || '-' }}
      td.text-xs-center {{ item.quantity }}
      td
        v-text-field(v-model="item.excise"
              name="excise"
              v-validate="'required|decimal|between:0,100'")
      td
        v-text-field(v-model="item.tax"
              name="tax"
              v-validate="'required|decimal|between:0,100'")
      td
        v-text-field(v-model="item.vat"
              name="vat"
              v-validate="'required|decimal|between:0,100'")
      td
        v-text-field(v-model="item.cleaning"
              name="cleaning"
              v-validate="'required|decimal|between:0,100'")
      td.grey.lighten-3 {{ costPriceNonCash | roundUp }}
      td
        v-text-field(v-model="item.non_cash_profitability"
          name="profitability"
          v-validate="'required|between:0,100'")
      td
        v-text-field(v-model="item.income_tax"
          name="income_tax"
          v-validate="'required|between:0,100'")
      td.grey.lighten-3 {{ firstCost | roundUp }}
      td
        v-text-field(v-model="item.cash_profitability"
          name="profitability"
          v-validate="'required|between:0,100'")
      td.grey.lighten-3 {{ secondCost | roundUp }}
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
      return this.item.product.packing * parseFloat(this.item.quantity || 0);
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
    profitabilityNonCashValue() {
      return (this.costPriceNonCash // Себестоимость БН
                + this.transport_expanses_non_cash
                + this.period_expanses_non_cash_per_unit)// Затраты на поставку (бн)
                * (parseFloat(this.item.non_cash_profitability) / 100);
    },
    // Размер налога на прибыль
    incomeTaxValue() {
      return parseFloat(this.profitabilityNonCashValue * this.item.income_tax / 100);
    },
    // Цена БН для списания
    firstCost() {
      return (this.costPriceNonCash
                + this.transport_expanses_non_cash
                + this.period_expanses_non_cash_per_unit
                + this.profitabilityNonCashValue
                + this.incomeTaxValue)
                * (1 + this.item.vat / 100);
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
    profitabilityCashValue() {
      return (this.costPriceCash
              + this.transport_expanses_per_unit_cash
              + this.period_expanses_cash_per_unit)
              * (parseFloat(this.item.cash_profitability) / 100);
    },
    // Цена Н для расчетов
    secondCost() {
      return this.costPriceCash
              + this.period_expanses_cash_per_unit
              + this.transport_expanses_per_unit_cash
              + this.transport_expanses_cash
              + this.profitabilityCashValue;
    },
  },
};
</script>

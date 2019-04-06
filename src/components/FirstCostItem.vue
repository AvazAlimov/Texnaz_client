<template lang="pug">
    tr
      td {{ item.product.name }}
      td {{ item.product.packing }}
      td {{ item.product.color }}
      td {{ costPriceNonCash }}
      td {{ transport_non_cash_expanses_rate }}
      td {{ non_cash_expanses_rate }} %
      td
        v-text-field(v-model="item.cash_profitability"
          name="profitability"
          v-validate="'required|between:0,100'")
      td {{ profitabilityValue }}
      td
        v-text-field(v-model="item.income_tax"
          name="income_tax"
          v-validate="'required|between:0,100'")
      td {{ incomeTaxValue }}
      td {{ firstCost }}
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
    non_cash_expanses_rate() {
      let sum = 0;
      this.batch.expanses.forEach((expanse) => {
        if (!expanse.is_transport && !expanse.is_cash) sum += expanse.value;
      });
      return (sum / this.batch.total) * 100 > 4 ? ((sum / this.batch.total) * 100).toFixed(2) : 4;
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
    exciseValue() {
      const value = (parseFloat(this.item.customs_price)
                    + this.batch.transport_non_cash / this.totalWeight)
                    * (this.item.excise / 100);
      return this.roundUp(value, 2);
    },
    taxValue() {
      const value = (parseFloat(this.item.customs_price)
                    + this.batch.transport_non_cash / this.totalWeight)
                    * (this.item.tax / 100);
      return this.roundUp(value, 2);
    },
    vatValue() {
      const value = (parseFloat(this.item.customs_price)
                    + this.exciseValue
                    + this.taxValue
                    + this.batch.transport_non_cash / this.totalWeight)
                    * (this.item.vat / 100);
      return this.roundUp(value, 2);
    },
    cleaningValue() {
      const value = (parseFloat(this.item.customs_price)
                    + this.exciseValue
                    + this.taxValue
                    + this.batch.transport_non_cash / this.totalWeight)
                    * (this.item.cleaning / 100);
      return this.roundUp(value, 2);
    },
    costPriceNonCash() {
      const value = (this.batch.transport_non_cash / this.totalWeight
                    + parseFloat(this.item.customs_price)
                    + this.exciseValue
                    + this.taxValue
                    + this.cleaningValue);
      return this.roundUp(value, 2);
    },
    profitabilityValue() {
      const value = (parseFloat(this.costPriceNonCash)
                    + parseFloat(this.transport_non_cash_expanses_rate))
                    * (parseFloat(this.item.cash_profitability) / 100)
                    * (1 + (parseFloat(this.non_cash_expanses_rate) / 100));
      return this.roundUp(value, 2);
    },
    incomeTaxValue() {
      const value = parseFloat(this.profitabilityValue * this.item.income_tax / 100);
      return this.roundUp(value, 2);
    },
    firstCost() {
      const value = (parseFloat(this.costPriceNonCash)
                    + parseFloat(this.profitabilityValue)
                    + parseFloat(this.incomeTaxValue))
                    * this.batch.market_rate;
      return Math.round(value / 100) * 100;
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

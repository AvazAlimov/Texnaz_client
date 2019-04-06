<template lang="pug">
    tr
      td {{ item.product.name }}
      td {{ item.product.packing }}
      td {{ item.product.color }}
      td {{ costPriceCash }}
      td {{ transport_cash_expanses_rate }}
      td {{ cash_expanses_rate }} %
      td {{ non_cash_expanses_rate }} %
      td
        v-text-field(v-model="item.non_cash_profitability"
          name="profitability"
          v-validate="'required|between:0,100'")
      td {{ profitabilityValue }}
      td {{ secondCost }}
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
    totalWeight() {
      let sum = 0;
      this.batch.items.forEach((element) => {
        sum += element.product.packing * element.quantity;
      });
      return sum;
    },
    costPriceCash() {
      const value = parseFloat(this.item.contract_price)
                    - parseFloat(this.item.customs_price);
      return this.roundUp(value, 2);
    },
    profitabilityValue() {
      const value = (parseFloat(this.costPriceCash)
                    + parseFloat(this.cash_expanses_rate))
                    * (parseFloat(this.item.non_cash_profitability) / 100)
                    * (1 + (parseFloat(this.non_cash_expanses_rate) / 100));
      return this.roundUp(value, 2);
    },
    secondCost() {
      const value = (parseFloat(this.costPriceCash)
                    + parseFloat(this.transport_cash_expanses_rate)
                    + parseFloat(this.cash_expanses_rate)
                    + parseFloat(this.profitabilityValue));
      return this.roundUp(value, 2);
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

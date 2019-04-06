<template lang="pug">
    tr
      td {{ item.product.name }}
      td {{ item.product.packing }}
      td {{ item.product.color }}
      td {{ item.quantity }}
      td {{ weight }}
      td
          v-text-field(v-model="item.contract_price"
            name="contract_price"
            v-validate="'required|decimal'")
      td
          v-text-field(v-model="item.customs_price"
            name="customs_price"
            v-validate="'required|decimal'")
      td {{ item.contract_price / item.product.packing }}
      td {{ item.customs_price / item.product.packing }}
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
      td {{ exciseValue }}
      td {{ taxValue }}
      td {{ vatValue }}
      td {{ cleaningValue }}
      td {{ costPriceNonCash }}
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
      return (this.item.product.packing * parseFloat(this.item.quantity || 0)).toFixed(2);
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
  },
  methods: {
    roundUp(num, precision) {
      precision = 10 ** precision;
      return Math.ceil(num * precision) / precision;
    },
  },
};
</script>

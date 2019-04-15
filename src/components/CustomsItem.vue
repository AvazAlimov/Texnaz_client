<template lang="pug">
    tr
      td {{ item.product.name }}
      td {{ item.product.packing }}
      td {{ item.product.color }}
      td {{ item.quantity }}
      td {{ weight | roundUp }}
      td
          v-text-field(v-model="item.contract_price"
            name="contract_price"
            v-validate="'required|decimal'")
      td
          v-text-field(v-model="item.customs_price"
            name="customs_price"
            v-validate="'required|decimal'")
      td {{ (item.contract_price / item.product.packing) | roundUp }}
      td {{ (item.customs_price / item.product.packing) | roundUp }}
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
      td {{ exciseValue | roundUp }}
      td {{ taxValue | roundUp }}
      td {{ vatValue | roundUp }}
      td {{ cleaningValue }}
      td {{ costPriceNonCash | roundUp }}
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
  },
};
</script>

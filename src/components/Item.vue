<template lang="pug">
    tr
        td {{ name }}
        td {{ packing }}
        td {{ color }}
        td
            v-text-field(v-model="quantity")
        td {{ weight }}
        td.red
            v-text-field(v-model="contract_price")
        td
            v-text-field(v-model="customs_price")
        td
            v-text-field(v-model="excise")
        td
            v-text-field(v-model="tax")
        td
            v-text-field(v-model="vat")
        td
            v-text-field(v-model="cleaning")
        td
            v-text-field(v-model="profitability")
        td
        td
        td
        td
        td
</template>

<script>
import Product from '@/services/Product';

export default {
  name: 'Item',
  props: {
    productId: {
      required: true,
    },
  },
  data() {
    return {
      name: '',
      packing: 0,
      color: '',
      quantity: 0,
      contract_price: 0,
      customs_price: 0,
      excise: 0,
      tax: 0,
      vat: 0,
      cleaning: 0,
      profitability: 0,
    };
  },
  computed: {
    weight() {
      return (this.packing * parseFloat(this.quantity || 0)).toFixed(2);
    },
  },
  methods: {
    getAll() {
      Product.get(this.productId)
        .then((product) => {
          this.name = product.name;
          this.packing = product.packing;
          this.color = product.color;
          this.excise = product.excise;
          this.tax = product.tax;
          this.vat = product.vat;
          this.cleaning = product.cleaning;
        });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

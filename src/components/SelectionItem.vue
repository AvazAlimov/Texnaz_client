<template lang="pug">
    tr
        td {{ name }}
        td {{ packing }}
        td {{ color }}
        td
            v-text-field(v-model="quantity")
        td {{ weight }}
        td
            v-text-field(v-model="contract_price")
        td
            v-text-field(v-model="customs_price")
        td {{ contract_price / packing }}
        td {{ customs_price / packing }}
</template>

<script>
import Product from '@/services/Product';

export default {
  name: 'Item',
  props: {
    batch: {
      required: true,
    },
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

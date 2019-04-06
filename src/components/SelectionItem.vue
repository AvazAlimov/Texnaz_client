<template lang="pug">
    tr
        td {{ item.product.name }}
        td {{ item.product.packing }}
        td {{ item.product.color }}
        td
          v-text-field(v-model="item.quantity"
            name="quantity"
            v-validate="'required|decimal|min:0'")
        td {{ weight }}
        td
          v-btn.mx-0(icon)
            v-icon(color="primary" small @click="remove(item.productId)") close
</template>

<script>
export default {
  name: 'Item',
  props: {
    item: {
      required: true,
    },
    remove: {
      required: true,
    },
  },
  computed: {
    weight() {
      return (this.item.product.packing * parseFloat(this.item.quantity || 0)).toFixed(2);
    },
  },
};
</script>

<template lang="pug">
    tr
        td {{ item.product.name }}
        td.text-xs-center {{ item.product.packing }}
        td.text-xs-center {{ item.product.color ? item.product.color : '-' }}
        td
          v-text-field(v-model="item.quantity"
            :error-messages="errors.first('количество')"
            name="количество"
            v-validate="'required|decimal|min:0'")
        td {{ weight | roundUp }}
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
      return this.item.product.packing * parseFloat(this.item.quantity || 0);
    },
  },
};
</script>

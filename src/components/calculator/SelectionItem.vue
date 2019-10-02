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
        td
          v-text-field(v-model="item.contract_price"
            name="цена контрактная"
            :error-messages="errors.first('цена контрактная')"
            v-validate="'required|decimal'")
        td
          v-text-field(v-model="item.customs_price"
            name="цена таможенная"
            :error-messages="errors.first('цена таможенная')"
            v-validate="'required|decimal'")
        td {{ weight | roundUp }}
        td {{ (item.contract_price / item.product.packing) || 0 | roundUp }}
        td {{ (item.customs_price / item.product.packing) || 0 | roundUp }}
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

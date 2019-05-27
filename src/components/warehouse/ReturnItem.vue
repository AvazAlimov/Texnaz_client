<template lang="pug">
    tr
        td
            v-checkbox(
                v-model="item.selected"
                hide-details
                color="secondary"
            )
        td {{ item.stock.product.code || '-' }}
        td {{ item.stock.product.Brand.name }} {{ item.stock.product.name }}
        td {{ item.stock.product.packing }}
        td {{ item.stock.product.color || '-' }}
        td {{ item.quantity || '-' }}
        td {{ item.stock.arrival_date | moment('YYYY-MM-DD') }}
        td {{ item.stock.expiry_date | moment('YYYY-MM-DD') }}
        td {{ item.stock.defected ? 'поврежден' : 'хорошо' }}
        td {{ item.From.name }} {{ item.From.company }}
        td
            v-text-field(
                v-model="arrived"
                color="secondary"
                name="arrived"
                v-validate="{\
                    required: true,\
                    decimal: true,\
                    min_value: 0,\
                    max_value: item.quantity\
                }"
            )
</template>

<script>
export default {
  name: 'ReturnItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    arrived: 0,
  }),
  watch: {
    arrived(value) {
      this.item.arrived = parseFloat(value);
    },
  },
  created() {
    this.item.selected = false;
    this.item.arrived = this.arrived;
  },
};
</script>

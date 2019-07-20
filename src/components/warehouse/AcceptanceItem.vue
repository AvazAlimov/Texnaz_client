<template lang="pug">
  tr
    td
      v-checkbox(
        v-model="selected"
        hide-details
        color="secondary"
      )
    td {{ item.stock.product.Brand.name }}
      |  {{ item.stock.product.name }}
    td {{ item.stock.product.code || '-' }}
    td {{ item.stock.product.packing }}
    td {{ item.stock.product.color || '-' }}
    td
      v-text-field(
        v-model="arrived"
        color="secondary"
        name="arrived"
        v-validate="{\
          required: true,\
          numeric: true,\
          min_value: 0,\
          max_value: item.quantity,\
        }"
      )
        template(v-slot:append-outer)
          .mt-1 {{ `/${item.quantity}` }}
    td {{ item.stock.defected ? 'Поврежден' : 'Хорошо' }}
    td {{ item.stock.arrival_date | moment('YYYY-MM-DD') }}
    td {{ item.stock.expiry_date | moment('YYYY-MM-DD') }}
</template>

<script>
export default {
  name: 'AcceptanceItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    selected: false,
    arrived: 0,
  }),
  watch: {
    selected(value) {
      this.arrived = value ? this.item.quantity : 0;
    },
    arrived(value) {
      this.item.arrived = parseFloat(value);
      this.selected = this.item.arrived === this.item.quantity;
    },
  },
  created() {
    this.item.arrived = this.arrived;
  },
};
</script>

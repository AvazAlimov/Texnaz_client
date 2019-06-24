<template lang="pug">
  tr
    td
      v-checkbox(
        v-if="!readOnly"
        color="secondary"
        :value="selected"
        hide-details
        @change="select()")
    td {{ item.arrival_date | moment('YYYY-MM-DD') }}
    td {{ item.expiry_date | moment('YYYY-MM-DD') }}
    td {{ item.quantity }}
    td {{ booked + sales }}
    td {{( item.quantity - booked - sales) * item.product.packing}}
    td
      v-btn.ma-0(
        v-if="booked + sales > 0"
        @click="show()"
        flat icon color="secondary")
        v-icon(small) visibility
</template>

<script>
export default {
  name: 'StockItem',
  props: {
    select: {
      required: true,
    },
    selected: {
      required: true,
    },
    readOnly: {
      type: Boolean,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    show: {
      required: true,
    },
  },
  computed: {
    available() {
      return this.item.quantity - this.booked - this.sales;
    },
    booked() {
      let bookings = 0;
      this.item.bookings.forEach((booking) => {
        bookings += booking.quantity;
      });
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.item.booked = bookings;
      return bookings;
    },
    sales() {
      let sales = 0;
      this.item.sales.forEach((saleItem) => {
        if (saleItem.approved < 1) { sales += saleItem.quantity; }
      });
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.item.sold = sales;
      return sales;
    },
  },
};
</script>

<template lang="pug">
  tr.selectable(v-if="readOnly ? true : !!available" @click="expand()")
    td(v-if="!readOnly")
      v-icon(v-if="selected" small) check
    td {{ item.product.code || '-' }}
    td {{ item.product.Brand.name }}
    td {{ item.product.Brand.manufacturer }}
    td {{ item.product.name }}
    td {{ item.product.packing }}
    td {{ item.product.color || '-' }}
    td {{ item.quantity }}
    td {{ booked + sales }}
    td {{( item.quantity - booked - sales) * item.product.packing}}
</template>

<script>
export default {
  name: 'StockItem',
  props: {
    expand: {
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
  },
  computed: {
    available() {
      return this.item.quantity - this.booked - this.sales;
    },
    booked() {
      let bookings = 0;
      this.item.stocks.forEach((stock) => {
        stock.bookings.forEach((booking) => {
          bookings += booking.quantity;
        });
      });
      return bookings;
    },
    sales() {
      let sales = 0;
      this.item.stocks.forEach((stock) => {
        stock.sales.forEach((saleItem) => {
          if (saleItem.approved === 0) { sales += saleItem.quantity; }
        });
      });
      return sales;
    },
  },
};
</script>

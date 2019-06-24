<template lang="pug">
    v-dialog(:value="value" persistent)
      .white(v-if="stock")
        .title.px-4.py-3 {{ stock.product.Brand.name }}\{{ stock.product.Brand.manufacturer }}
          |  {{ stock.product.name }}
        v-divider
        v-data-table(
          :headers="headers"
          :items="bookings"
          hide-actions
        )
          template(v-slot:items="props")
            td {{ props.item.user.name }}
            td {{ props.item.client.name }}
            td {{ props.item.date ? (props.item.date.substring(0, 10)) : 'Реализация' }}
            td {{ props.item.quantity }}
        v-divider
        v-layout(row)
          v-spacer
          v-btn.ma-0(flat color="secondary" @click="$emit('input', false)") Закрыть
</template>

<script>

export default {
  name: 'StockBookings',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    stock: null,
    headers: [
      {
        text: 'Менеджер',
        value: 'user.name',
      },
      {
        text: 'Клиент',
        value: 'client.name',
      },
      {
        text: 'Бронирован до',
        value: 'date',
      },
      {
        text: 'Количество',
        value: 'quantity',
      },
    ],
  }),
  computed: {
    bookings() {
      const bookings = [];
      if (this.stock) {
        this.stock.bookings.forEach((booking) => {
          bookings.push(booking);
        });
        this.stock.sales.forEach((saleItem) => {
          if (saleItem.approved < 1) {
            bookings.push({
              user: saleItem.sale.manager,
              client: saleItem.sale.client,
              quantity: saleItem.quantity,
            });
          }
        });
      }
      return bookings;
    },
  },
  methods: {
    setStock(stock) {
      this.stock = stock;
    },
  },
};
</script>

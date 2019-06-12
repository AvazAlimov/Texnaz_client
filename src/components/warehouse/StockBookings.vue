<template lang="pug">
    v-dialog(:value="value" persistent)
      .white
        .title.px-4.py-3 {{ stock.product.Brand.name }}\{{ stock.product.Brand.manufacturer }}
          |  {{ stock.product.name }}
        v-divider
        v-data-table(
          :headers="headers"
          :items="stock.bookings"
          hide-actions
        )
          template(v-slot:items="props")
            td {{ props.item.user.name }}
            td {{ props.item.client.name }}
            td {{ props.item.date | moment('YYYY-MM-DD') }}
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
    stock: {
      product: {
        Brand: {},
      },
      bookings: [],
    },
    headers: [
      {
        text: 'Менеджер',
        value: 'manager.name',
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
  methods: {
    setStock(stock) {
      this.stock = stock;
    },
  },
};
</script>

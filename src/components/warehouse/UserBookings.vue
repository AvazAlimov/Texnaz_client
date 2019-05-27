<template lang="pug">
    .white.border
        v-data-table(
          v-model="selected"
          select-all
          hide-actions
          :headers="headers"
          :items="bookings"
        )
          template(v-slot:items="props")
            td
              v-checkbox(
                v-model="props.selected"
                hide-details
                color="secondary"
              )
            td {{ props.item.stock.product.code || '-' }}
            td {{ props.item.stock.product.Brand.name }} {{ props.item.stock.product.name }}
            td {{ props.item.stock.product.packing }}
            td {{ props.item.stock.product.color || '-' }}
            td {{ props.item.stock.defected ? 'Поврежден' : 'Хорошо' }}
            td {{ props.item.quantity }}
            td {{ props.item.stock.warehouse.name }} {{ props.item.stock.warehouse.company }}
            td {{ props.item.client.name }}
        v-divider
        v-layout(row wrap)
          v-spacer
          v-btn.ma-0.mr-1(
            flat
            :loading="loading"
            @click="submit()"
            color="secondary"
            :disabled="!selected.length"
          ) Отменить бронирование
</template>

<script>
import Booking from '@/services/Booking';

export default {
  name: 'UserBookings',
  props: {
    userId: {
      required: true,
    },
  },
  data: () => ({
    loading: false,
    bookings: [],
    selected: [],
    headers: [
      {
        text: 'Код товара',
        value: 'product.code',
      },
      {
        text: 'Наименование',
        value: 'product.name',
      },
      {
        text: 'Фасовка',
        value: 'product.packing',
      },
      {
        text: 'Цвет',
        value: 'product.color',
      },
      {
        text: 'Состояние',
        value: 'defected',
      },
      {
        text: 'Количество',
        value: 'quantity',
      },
      {
        text: 'Склад',
        value: 'stock.warehouseId',
      },
      {
        text: 'Клиент',
        value: 'clientId',
      },
    ],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Booking.getAll(this.$route.params.id)
        .then((bookings) => { this.bookings = bookings; })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    submit() {
      this.loading = true;
      const tasks = [];
      this.selected.forEach((booking) => {
        tasks.push(Booking.delete(booking.id));
      });
      Promise.all(tasks)
        .then(() => this.getAll())
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

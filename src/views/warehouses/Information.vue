<template lang="pug">
  v-layout(row wrap align-center)
    v-flex(xs12)
      .border.white
        v-data-table(
          :headers="headers"
          :items="stocks"
          hide-actions
          :loading="loading")
          template(v-slot:items="props")
            tr(
              @click="props.expanded = !props.expanded"
              :class="{'grey': props.expanded, 'lighten-2': props.expanded}"
            )
              td {{ props.item.product.Brand.name }}
              td {{ props.item.product.name }}
              td {{ props.item.product.packing }}
              td {{ props.item.product.color || '-' }}
              td {{ props.item.quantity }}
              td {{ props.item.quantity * props.item.product.packing }}
              td {{ getBooked(props.item) }}
          template(v-slot:expand="props")
            .pb-4.grey.lighten-2
              v-data-table(
                :headers="expandedHeaders"
                :items="props.item.stocks"
                :loading="loading"
                hide-actions
              )
                template(v-slot:items="stocks")
                  td {{ stocks.item.defected ? 'поврежден' : '' }}
                  td {{ stocks.item.arrival_date.substring(0, 10) }}
                  td {{ stocks.item.expiry_date.substring(0, 10) }}
                  td {{ stocks.item.quantity }}
                  td {{ stocks.item.quantity * props.item.product.packing }}
                  td {{ stocks.item.bookings.map(a => a.quantity).reduce((a,b) => a + b, 0) }}
</template>

<script>
import Stock from '@/services/Stock';

export default {
  name: 'Information',
  data() {
    return {
      headers: [
        {
          text: 'Бренд',
          value: 'product.Brand.name',
          width: 1,
        },
        {
          text: 'Наименование',
          value: 'product.name',
        },
        {
          text: 'Фасовка',
          value: 'product.packing',
          width: 1,
        },
        {
          text: 'Цвет',
          value: 'product.color',
          width: 1,
        },
        {
          text: 'Количество',
          value: 'quantity',
          width: 1,
        },
        {
          text: 'Вес',
          value: 'quantity',
          width: 1,
        },
        {
          text: 'Забронировано',
          value: 'booked',
          width: 1,
        },
      ],
      expandedHeaders: [
        {
          text: 'Состояние',
          value: 'defected',
          // width: 1,
        },
        {
          text: 'Дата прибытия',
          value: 'arrival_date',
          // width: 1,
        },
        {
          text: 'Срок действия',
          value: 'expiry_date',
          // width: 1,
        },
        {
          text: 'Количество',
          value: 'quantity',
          width: 1,
        },
        {
          text: 'Вес',
          value: 'quantity',
          width: 1,
        },
        {
          text: 'Забронировано',
          value: 'booked',
          width: 1,
        },
      ],
      stocks: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.stocks = [];
      Stock.getByWarehouse(this.$route.params.id)
        .then((stocks) => {
          this.stocks = [];
          stocks.forEach((stock) => {
            const row = this.stocks.find(element => element.product.id === stock.product.id);
            if (!row) {
              // Insert a new row
              this.stocks.push({
                id: stock.product.id,
                product: stock.product,
                quantity: stock.quantity,
                arrival_date: stock.arrival_date,
                expiry_date: stock.expiry_date,
                defected: stock.defected,
                stocks: [stock],
              });
            } else {
              row.quantity += stock.quantity;
              row.stocks.push(stock);
            }
          });
          // this.stocks = stocks;
        })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
    getBooked(item) {
      let bookings = 0;
      item.stocks.forEach((stock) => {
        stock.bookings.forEach((booking) => {
          bookings += booking.quantity;
        });
      });
      return bookings;
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>
</style>

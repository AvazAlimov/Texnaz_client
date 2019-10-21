<template lang="pug">
    div
      .border.white.pa-2
          .title.ma-2 Учет товара
          v-data-table(
            :loading="loading"
            :headers="headers"
            :items="shippedProducts"
            hide-actions
          )
            template(v-slot:items="props")
              td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td {{ props.item.number }}
              td {{ props.item.warehouse.name }} {{ props.item.warehouse.company }}
              td {{ props.item.client.icc }}
              td {{ props.item.client.name }}
              td {{ props.item.manager.name }}
              td {{ getAccountingPrice(props.item) || 0 | roundUp | readable}}сум
              td
                v-layout(row)
                  v-btn.ma-0(
                    flat icon color="secondary"
                    :to="{ name: 'shipment', params: {id: props.item.id},\
                      query:{ accounting: true }}")
                    v-icon(small) visibility
                  v-btn.ma-0(
                    flat icon color="green" @click="accept(props.item)")
                    v-icon(small) check
      .border.white.pa-2.mt-5
          .title.ma-2 История товара
          v-data-table(
            :loading="loading"
            :headers="headers"
            :items="notShippedProducts"
          )
            template(v-slot:items="props")
              td {{ props.item.createdAt | moment('YYYY-MM-DD HH:mm') }}
              td {{ props.item.number }}
              td {{ props.item.warehouse.name }} {{ props.item.warehouse.company }}
              td {{ props.item.client.icc }}
              td {{ props.item.client.name }}
              td {{ props.item.manager.name }}
              td {{ getAccountingPrice(props.item) || 0 | roundUp | readable}}сум
              td
                v-layout(row)
                  v-btn.ma-0(
                    flat icon color="secondary"
                    :to="{ name: 'shipment', params: {id: props.item.id},\
                      query:{ accounting: true }}")
                    v-icon(small) visibility
</template>
<script>
import Sale from '@/services/Sale';

export default {
  data() {
    return {
      sales: [],
      loading: false,
      headers: [
        {
          text: 'Дата',
          value: 'createdAt',
        },
        {
          text: 'Номер',
          value: 'id',
        },
        {
          text: 'Склад',
          value: 'warehouse.name',
        },
        {
          text: 'ИКК',
          value: 'client.icc',
        },
        {
          text: 'Клиент',
          value: 'client.name',
        },
        {
          text: 'Менеджер',
          value: 'manager.name',
        },
        {
          text: 'Сумма',
          value: 'price',
          sortable: false,
        },
        {
          sortable: false,
        },
      ],
    };
  },
  computed: {
    shippedProducts() {
      return this.sales.filter(({ isClosed, accepted }) => isClosed && !accepted);
    },
    notShippedProducts() {
      return this.sales.filter(({ isClosed, accepted }) => isClosed && accepted);
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      Promise.all([Sale.getAll()])
        .then((results) => {
          [this.sales] = results;
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => {
          this.loading = false;
        });
    },
    getAccountingPrice(sale) {
      let total = 0;
      switch (sale.type) {
        case 1:
          sale.items.forEach((item) => {
            total
              += (item.price.firstPrice * item.quantity * (100 - item.discount))
              / 100;
          });
          break;
        case 2:
          // mixPriceNonCash
          sale.items.forEach((item) => {
            total
              += (item.price.mixPriceNonCash
                * item.quantity
                * (100 - item.discount))
              / 100;
          });
          break;
        case 3:
          // mixPriceNonCash
          sale.items.forEach((item) => {
            total
              += (item.price.mixPriceNonCash
                * item.quantity
                * (100 - item.discount))
              / 100;
          });
          break;
        case 4:
          // commissionPrice
          sale.items.forEach((item) => {
            total
              += (item.commissionPrice * item.quantity * (100 - item.discount))
              / 100;
          });
          break;
        default:
          break;
      }
      return total;
    },
    accept({ id }) {
      Sale.accept(id)
        .then(() => this.getAll())
        .catch(err => this.$store.commit('setMessage', err.message));
    },
  },
  created() {
    this.getAll();
  },
};
</script>

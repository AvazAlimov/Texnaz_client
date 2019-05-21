<template lang="pug">
  .border.white
    v-data-table(
      :headers="headers"
      :items="prices"
      :loading="loading"
      hide-actions)
      template(v-slot:items="props")
        tr(@click="props.expanded = !props.expanded")
          td {{ props.index + 1 }}
          td {{ props.item.product.Brand.name }} {{ props.item.product.name }}
          td.text-xs-center {{ props.item.product.packing }}
          td.blue.lighten-4 {{ props.item.firstPrice }}
          td.orange.lighten-4 {{ props.item.mixPriceNonCash }}
          td.orange.lighten-4 {{ props.item.mixPriceCash }}
          td.green.lighten-4 {{ props.item.secondPrice }}
          td {{ props.item.createdAt | moment("HH:mm DD-MM-YYYY") }}
      template(v-slot:expand="props")
        v-data-table#expanded(
          :headers="expandedHeaders"
          :items="props.item.prices"
          :loading="loading"
          hide-actions
        )
          template(v-slot:items="prices")
            tr(@click="prices.expanded = !prices.expanded")
              td
              td
              td
              td.blue.lighten-5 {{ prices.item.firstPrice }}
              td.orange.lighten-5 {{ prices.item.mixPriceNonCash }}
              td.orange.lighten-5 {{ prices.item.mixPriceCash }}
              td.green.lighten-5 {{ prices.item.secondPrice }}
              td {{ prices.item.createdAt | moment("HH:mm DD-MM-YYYY") }}
        v-divider
</template>

<script>
import Price from '@/services/Price';

export default {
  name: 'PricedProducts',
  data() {
    return {
      loading: true,
      headers: [{
        text: '#',
        value: 'index',
        sortable: false,
        width: 1,
        invisible: true,
      },
      {
        text: 'Наименование',
        value: 'product.name',
        invisible: true,
      },
      {
        text: 'Фасовка',
        value: 'product.packing',
        align: 'center',
        width: 1,
        invisible: true,
      },
      {
        text: 'Цена №1 (БН)',
        value: 'price',
        sortable: false,
        width: 1,
      },
      {
        text: 'Цена №2 (БН)',
        value: 'price',
        sortable: false,
        width: 1,
      },
      {
        text: 'Цена №2 (Н)',
        value: 'price',
        sortable: false,
        width: 1,
      },
      {
        text: 'Цена №3 (Н)',
        value: 'price',
        sortable: false,
        width: 1,
      },
      {
        text: 'Дата генерации',
        value: 'createdAt',
        sortable: false,
        width: 1,
      }],
      prices: [],
    };
  },
  computed: {
    expandedHeaders() {
      const columns = [];
      this.headers.forEach((column) => {
        columns.push({
          text: column.text,
          value: column.value,
          sortable: false,
          width: column.width,
          class: [column.invisible ? 'transparent--text' : 'gray--text'],
        });
      });
      return columns;
    },
  },
  methods: {
    getAll() {
      this.loading = true;
      this.prices = [];
      Price.getAll()
        .then((prices) => {
          this.prices = this.group(prices.sort((a, b) => (a.id < b.id ? 0 : -1)));
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    group(prices) {
      const groupedPrices = [];
      prices.forEach((price) => {
        const groupedPrice = groupedPrices.find(item => item.product.id === price.product.id);
        if (groupedPrice) {
          groupedPrice.prices.push(price);
        } else {
          const index = groupedPrices.push(price) - 1;
          groupedPrices[index].prices = [];
        }
      });
      return groupedPrices;
    },
  },
  created() {
    this.getAll();
  },
};
</script>
<style scoped>
.bottom__border {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}
</style>

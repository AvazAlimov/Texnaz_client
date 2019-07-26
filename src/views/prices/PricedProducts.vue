<template lang="pug">
  .border.white
    v-data-table(
      :headers="headers"
      :items="prices"
      :loading="loading"
      hide-actions)
      template(v-slot:items="props")
        tr
          td {{ props.index + 1 }}
          td {{ props.item.product.Brand.name }}
          td {{ props.item.product.Brand.manufacturer }}
          td {{ props.item.product.name }}
          td.text-xs-center {{ props.item.product.color || '-' }}
          td.text-xs-center {{ props.item.product.packing }}
          td.orange.lighten-4 {{ props.item.mixPriceNonCash }}
          td.green.lighten-4 {{ props.item.secondPrice }}
          td {{ $b2c(props.item, officialRate, exchangeRate) | ceil }}
          td {{ $priceCash(props.item, exchangeRate) | roundUp }}
          td {{ props.item.createdAt | moment("HH:mm DD-MM-YYYY") }}
          td
            v-layout
              v-btn.ma-0(
                v-if="$hasRole(1)"
                flat color="secondary" icon
                :to="{name: 'editprice', params: {id: props.item.id}}")
                v-icon(small) edit
              v-btn.ma-0(flat color="secondary" icon @click="props.expanded = !props.expanded")
                v-icon {{ props.expanded ? 'expand_less' : 'expand_more' }}
      template(v-slot:expand="props")
        v-data-table#expanded(
          :headers="expandedHeaders"
          :items="props.item.prices"
          :loading="loading"
          hide-actions)
          template(v-slot:items="prices")
            tr(@click="prices.expanded = !prices.expanded")
              td
              td
              td
              td
              td
              td
              td.orange.lighten-5 {{ prices.item.mixPriceNonCash }}
              td.green.lighten-5 {{ prices.item.secondPrice }}
              td {{ $b2c(prices.item, officialRate, exchangeRate) | ceil }}
              td {{ prices.item.secondPrice - prices.item.mixPriceNonCash/ exchangeRate | roundUp }}
              td {{ prices.item.createdAt | moment("HH:mm DD-MM-YYYY") }}
              td
                div(style="width: 72px;")
        v-divider
</template>

<script>
import Price from '@/services/Price';
import Configuration from '@/services/Configuration';

export default {
  name: 'PricedProducts',
  data() {
    return {
      loading: true,
      headers: [
        {
          text: '#',
          width: 1,
          invisible: true,
          sortable: false,
        },
        {
          text: 'Бренд',
          value: 'product.Brand.name',
          invisible: true,
        },
        {
          text: 'Производитель',
          value: 'product.Brand.manufacturer',
          invisible: true,
        },
        {
          text: 'Наименование',
          value: 'product.name',
          invisible: true,
        },
        {
          text: 'Цвет',
          value: 'product.color',
          align: 'center',
          width: 1,
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
          text: 'Наценка (сум)',
          width: 1,
          sortable: false,
        },
        {
          text: 'B2B ($)',
          width: 1,
          sortable: false,
        },
        {
          text: 'B2C',
          width: 1,
          sortable: false,
        },
        {
          text: 'Наценка ($)',
          width: 1,
          sortable: false,
        },
        {
          text: 'Дата генерации',
          width: 1,
          sortable: false,
        },
        {
          width: 1,
          sortable: false,
        }],
      prices: [],
      exchangeRate: 1,
      officialRate: 1,
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
      Promise.all([
        Price.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
      ])
        .then((results) => {
          const [prices, exchangeRate, officialRate] = results;
          this.prices = this.group(prices.sort((a, b) => (a.id < b.id ? 0 : -1)));
          this.exchangeRate = exchangeRate.value;
          this.officialRate = officialRate.value;
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

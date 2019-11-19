<template lang="pug">
  .border.white
    v-layout(row wrap align-center)
      v-combobox(
        v-model="brand"
        :items="brands"
        item-text="name"
        label="Бренд"
        clearable
        color="secondary"
      ).mt-4.mb-4.ml-4.mr-2
      v-combobox(
        v-model="type"
        :items="types"
        item-text="name"
        label="Тип продукта"
        clearable
        color="secondary"
      ).mt-4.mb-4
      v-text-field(
        v-model="search"
        prepend-inner-icon="search"
        label="Поиск"
        color="secondary"
        clearable
      ).ma-4
      v-btn(
        icon
        flat
        color="secondary"
        @click="getAllCustom"
      ).ma-4
        v-icon table_chart
    v-data-table(
      :headers="headers"
      :items="filteredItems"
      :search="search"
      no-data-text="Нет информации"
      :loading="loading")
      template(v-slot:items="props")
        tr
          td {{ props.index + 1 }}
          td {{ props.item.code }}
          td {{ props.item.brand }}
          td {{ props.item.manufacturer }}
          td {{ props.item.name }}
          td.text-xs-center {{ props.item.color || '-' }}
          td.text-xs-center {{ props.item.packing }}
          td.orange.lighten-4 {{ props.item.mixPriceNonCash }}
          td.green.lighten-4 {{ props.item.secondPrice }}
          td {{ props.item.b2c | ceil }}
          td {{ props.item.mixPriceCash | roundUp }}
          td {{ props.item.date | moment("HH:mm DD-MM-YYYY") }}
          td
            v-layout
              v-btn.ma-0(
                v-if="$hasRole(1)"
                flat color="secondary" icon
                :to="{name: 'editprice', params: {id: props.item.id}}")
                v-icon(small) edit
              v-btn.ma-0(flat v-show="false" color="secondary"
                icon @click="props.expanded = !props.expanded")
                v-icon {{ props.expanded ? 'expand_less' : 'expand_more' }}
      template(v-slot:expand="props")
        v-data-table#expanded(
          :headers="expandedHeaders"
          :items="props.item.prices"
          :loading="loading")
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
import ProductType from '@/services/ProductType';
import Brand from '@/services/Brand';

export default {
  name: 'PricedProducts',
  data() {
    return {
      loading: false,
      brands: [],
      types: [],
      brand: null,
      type: null,
      search: '',
      headers: [
        {
          text: '#',
          width: 1,
          invisible: true,
          sortable: false,
        },
        {
          text: 'Код',
          value: 'code',
          invisible: true,
        },
        {
          text: 'Бренд',
          value: 'brand',
          invisible: true,
        },
        {
          text: 'Производитель',
          value: 'manufacturer',
          invisible: true,
        },
        {
          text: 'Наименование',
          value: 'name',
          invisible: true,
        },
        {
          text: 'Цвет',
          value: 'color',
          align: 'center',
          width: 1,
          invisible: true,
        },
        {
          text: 'Фасовка',
          value: 'packing',
          align: 'center',
          width: 1,
          invisible: true,
        },
        {
          text: 'Наценка (сум)',
          width: 1,
          value: 'mixPriceNonCash',
          sortable: false,
        },
        {
          text: 'B2B ($)',
          width: 1,
          sortable: false,
          value: 'secondPrice',
        },
        {
          text: 'B2C',
          width: 1,
          value: 'b2c',
          sortable: false,
        },
        {
          text: 'Наценка ($)',
          width: 1,
          sortable: false,
          value: 'mixPriceCash',
        },
        {
          text: 'Дата генерации',
          width: 1,
          sortable: false,
          value: 'date',
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
    filteredItems() {
      return this.prices.filter(item => (
        (this.brand ? item.brandId === this.brand.id : true)
        && (this.type ? item.type === this.type.id : true)
      ));
    },
  },
  methods: {
    getBrandsAndTypes() {
      Promise.all([
        Brand.getAll(),
        ProductType.getAll(),
      ]).then(result => {
        const [brands, types] = result;
        this.brands = brands;
        this.types = types;
      })
    },
    getAllCustom() {
      Promise.all([
        Price.getAllCustom(this.brand ? this.brand.id : null, this.type ? this.type.id : null),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
      ])
      .then(results => {
        const [prices, exchangeRate, officialRate] = results;
          this.prices = this.group(prices.sort((a, b) => (a.id < b.id ? 0 : -1)))
            .map(price => ({
              id: price.id,
              code: price.product.code,
              brandId: price.product.brand,
              type: price.product.type,
              brand: price.product.Brand.name,
              manufacturer: price.product.Brand.manufacturer,
              name: price.product.name,
              color: price.product.color,
              packing: price.product.packing,
              mixPriceNonCash: price.mixPriceNonCash,
              secondPrice: price.secondPrice,
              b2c: this.$b2c(price, officialRate.value, exchangeRate.value),
              mixPriceCash: this.$priceCash(price, exchangeRate.value),
              date: price.createdAt,
              prices: price.prices,
            }));
          this.exchangeRate = exchangeRate.value;
          this.officialRate = officialRate.value;
      })
    },
    getAll() {
      this.loading = true;
      this.prices = [];
      Promise.all([
        Price.getAll(),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
        Brand.getAll(),
        ProductType.getAll(),
      ])
        .then((results) => {
          const [prices, exchangeRate, officialRate, brands, types] = results;
          this.prices = this.group(prices.sort((a, b) => (a.id < b.id ? 0 : -1)))
            .map(price => ({
              id: price.id,
              code: price.product.code,
              brandId: price.product.brand,
              type: price.product.type,
              brand: price.product.Brand.name,
              manufacturer: price.product.Brand.manufacturer,
              name: price.product.name,
              color: price.product.color,
              packing: price.product.packing,
              mixPriceNonCash: price.mixPriceNonCash,
              secondPrice: price.secondPrice,
              b2c: this.$b2c(price, officialRate.value, exchangeRate.value),
              mixPriceCash: this.$priceCash(price, exchangeRate.value),
              date: price.createdAt,
              prices: price.prices,
            }));
          this.exchangeRate = exchangeRate.value;
          this.officialRate = officialRate.value;
          this.brands = brands;
          this.types = types;
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
    // this.getAll();
    this.getBrandsAndTypes();
  },
};
</script>

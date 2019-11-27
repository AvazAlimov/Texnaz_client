<template lang="pug">
  .white.pt-2
    v-layout(row wrap)
      v-flex(xs4).pl-4
          v-combobox(
              v-model="brand"
              :items="brands"
              item-value="id"
              item-text="name"
              label="Бренд"
              clearable
              color="secondary"
          )
      v-flex(xs4)
          v-combobox(
              v-model="type"
              :items="types"
              item-value="id"
              item-text="name"
              label="Тип продукта"
              clearable
              color="secondary"
          )
      v-flex(xs4).pr-4
          v-text-field(
              v-model="code"
              label="Код товара"
              color="secondary"
          )
      v-flex(xs12).px-4
          v-text-field(
              v-model="query"
              label="Поиск"
              color="secondary"
          )
      v-flex(xs12).pb-0
        v-divider
        v-data-table(
          :headers="headers"
          :items="filteredStocks"
          :loading="loading"
          fixed-height)
          template(v-slot:items="props")
            StockItem(
              :expand="() => {props.expanded = !props.expanded}"
              :selected="isSelected(props.item)"
              :readOnly="readOnly"
              :item="props.item"
            )
          template(v-slot:expand="props")
            .pb-4.grey.lighten-2
              v-data-table(
                :headers="expandedHeaders"
                :items="props.item.stocks"
                :loading="loading"
                hide-actions)
                template(v-slot:items="stocks")
                  StockItemExpanded(
                    :item="stocks.item"
                    :readOnly="readOnly"
                    :select="() => select(stocks.item)"
                    :selected="indexOf(stocks.item.id) != null"
                    :show="() => showBookings(stocks.item)"
                  )
        v-divider
        StockBookings(v-model="dialog" ref="stockBookings")
</template>

<script>
import Brand from '@/services/Brand';
import ProductType from '@/services/ProductType';
import Stock from '@/services/Stock';

export default {
  name: 'SearchStock',
  props: {
    warehouseId: {
      required: true,
    },
    items: {
      type: Array,
    },
    readOnly: {
      type: Boolean,
    },
  },
  data() {
    return {
      dialog: false,
      expandedHeaders: [
        {
          sortable: false,
        },
        {
          text: 'Дата прибытия',
          value: 'arrival_date',
        },
        {
          text: 'Срок действия',
          value: 'expiry_date',
        },
        {
          text: 'Количество',
          value: 'quantity',
          width: 1,
        },
        {
          text: 'Забронировано',
          value: 'booked',
          width: 1,
        },
        {
          text: 'Вес',
          value: 'quantity',
          width: 1,
        },
        {
          width: 1,
          sortable: false,
        },
      ],
      totalQuantity: 0,
      totalWeight: 0,
      loading: false,
      stocks: [],
      brands: [],
      types: [],
      brand: null,
      type: null,
      query: null,
      code: null,
    };
  },
  computed: {
    headers() {
      const headers = [
        {
          text: 'Код',
          value: 'product.code',
        },
        {
          text: 'Бренд',
          value: 'product.Brand.name',
        },
        {
          text: 'Производитель',
          value: 'product.Brand.manufacturer',
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
          text: `Количество (${this.$options.filters.readable(this.filteredStocks.reduce((a, b) => a + b.quantity, 0))})`,
          value: 'quantity',
        },
        {
          text: 'Забронировано',
          value: 'booked',
        },
        {
          text: `Вес (${this.$options.filters.readable(this.filteredStocks.reduce((a, b) => a + (b.product.packing * b.quantity), 0))}кг)`,
          value: 'quantity',
        },
        {
          text: 'Инфо',
          value: 'tag',
        },
      ];
      if (!this.readOnly) {
        headers.splice(0, 0, {
          sortable: false,
        });
      }
      return headers;
    },
    filteredStocks() {
      return this.stocks.filter(stock => (
        (this.query
          ? stock.product.name.toLowerCase().includes(this.query.toLowerCase())
          : true)
        && ((this.code)
          ? (stock.product.code && stock.product.code.toLowerCase()
            .includes(this.code.toLowerCase()))
          : true)
        && ((this.brand)
          ? stock.product.Brand.id === this.brand.id
          : true)
        && ((this.type)
          ? (stock.product.type && stock.product.type === this.type.id)
          : true)
        && stock.product.prices.length
      ));
    },
  },
  methods: {
    getAll() {
      Promise.all([
        Stock.getByWarehouse(this.warehouseId),
        Brand.getAll(),
        ProductType.getAll(),
      ])
        .then((warehouse) => {
          let stocks;
          [stocks, this.brands, this.types] = warehouse;
          stocks.forEach((stock) => {
            const row = this.stocks.find(item => item.product.id === stock.product.id);
            if (row) {
              row.stocks.push(stock);
              row.totalquantity += stock.quantity;
            } else {
              // eslint-disable-next-line no-param-reassign
              stock.stocks = [stock];
              // eslint-disable-next-line no-param-reassign
              stock.totalquantity = stock.quantity;
              this.stocks.push(stock);
            }
          });
        });
    },
    select(stock) {
      const position = this.indexOf(stock.id);
      if (position == null) {
        this.items.push(stock);
      } else {
        this.items.splice(position, 1);
      }
    },
    indexOf(stockId) {
      let position = null;
      this.items.forEach((item, index) => {
        if (item.id === stockId) {
          position = index;
        }
      });
      return position;
    },
    isSelected(stock) {
      return this.items.find(item => item.product.id === stock.product.id);
    },
    showBookings(stock) {
      this.$refs.stockBookings.setStock(stock);
      this.dialog = true;
    },
  },
  created() {
    this.getAll();
  },
};
</script>

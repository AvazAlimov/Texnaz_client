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
          hide-actions)
          template(v-slot:items="props")
              tr.selectable(
                v-if="readOnly ? true : (props.item.quantity - props.item.booked > 0)"
                @click="props.expanded = !props.expanded"
                :class="{'grey': props.expanded, 'lighten-2': props.expanded}")
                td(v-if="!readOnly")
                  v-icon(v-if="isSelected(props.item)" small) check
                td {{ props.item.product.code || '-' }}
                td {{ props.item.product.Brand.name }}
                td {{ props.item.product.Brand.manufacturer }}
                td {{ props.item.product.name }}
                td {{ props.item.product.packing }}
                td {{ props.item.product.color || '-' }}
                td {{ props.item.quantity }}
                td {{ props.item.booked }}
                td {{(props.item.quantity-props.item.booked)*props.item.product.packing}}
          template(v-slot:expand="props")
            .pb-4.grey.lighten-2
              v-data-table(
                :headers="expandedHeaders"
                :items="props.item.stocks"
                :loading="loading"
                hide-actions)
                template(v-slot:items="stocks")
                  tr.selectable(@click="readOnly ? null : select(stocks.item)")
                    td
                      v-icon(v-if="indexOf(stocks.item.id) != null" small) check
                    td {{ stocks.item.arrival_date | moment('YYYY-MM-DD') }}
                    td {{ stocks.item.expiry_date | moment('YYYY-MM-DD') }}
                    td {{ stocks.item.quantity }}
                    td {{ stocks.item.booked }}
                    td {{(stocks.item.quantity-stocks.item.booked)*props.item.product.packing}}
        v-divider
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
      ],
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
          text: 'Количество',
          value: 'quantity',
        },
        {
          text: 'Забронировано',
          value: 'booked',
        },
        {
          text: 'Вес',
          value: 'quantity',
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
            // eslint-disable-next-line no-param-reassign
            stock.booked = stock.bookings.map(a => a.quantity).reduce((a, b) => a + b, 0);
            const row = this.stocks.find(item => item.product.id === stock.product.id);
            if (row) {
              row.quantity += stock.quantity;
              row.booked += stock.booked;
              row.stocks.push(stock);
            } else {
              this.stocks.push({
                id: stock.id,
                product: stock.product,
                quantity: stock.quantity,
                stocks: [stock],
                booked: stock.booked,
              });
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
  },
  created() {
    this.getAll();
  },
};
</script>

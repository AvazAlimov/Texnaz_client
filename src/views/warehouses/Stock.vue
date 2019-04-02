<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12).mb-3
            v-layout(align-center)
                v-btn(icon :to="{ name: 'warehouse' }")
                    v-icon arrow_back
                .title Добавление
        v-flex(xs12)
            .border.white.pa-4
                v-layout(row wrap)
                    v-flex(xs6)
                        .title Склад
                        .subheading {{ warehouse.name }} - {{ warehouse.company }}
                    v-flex(xs6)
                        .title Владелец
                        .subheading {{ warehouse.owner.name }}
                    v-flex(xs12)
                        v-divider.my-4
                        .title Поиск товаров
                    v-flex(xs6)
                        v-combobox(
                            v-model="brand"
                            :items="brands"
                            item-value="id"
                            item-text="name"
                            label="Бренд"
                            clearable
                        )
                    v-flex(xs6)
                        v-combobox(
                            v-model="type"
                            :items="types"
                            item-value="id"
                            item-text="name"
                            label="Тип продукта"
                            clearable
                        )
                    v-flex(xs12)
                        v-text-field(
                            v-model="query"
                            label="Поиск"
                        )
                    v-flex(xs12).my-3
                        .title Результаты: {{ products.length }}
                        v-data-table(
                            v-if="products.length"
                            :headers="headers"
                            :items="products"
                            :loading="loading"
                            hide-actions)
                            template(v-slot:items="props")
                                tr(@click="select(props.item)")
                                    td {{ props.item.name }}
                                    td {{ props.item.packing }}
                                    td {{ props.item.color }}
        v-flex(xs12 v-if="selected.length")
            .border.white.pa-4
                .title Выбрано: {{ selected.length }}
                v-data-table(
                    :headers="selected_headers"
                    :items="selected"
                    hide-actions)
                    template(v-slot:items="props")
                        td {{ props.item.name }}
                        td {{ props.item.packing }}
                        td {{ props.item.color }}
                        td
                            v-text-field(
                              v-model="props.item.quantity"
                              name="quantity"
                              v-validate="'required|decimal|min_value:0'")
                        td
                            v-text-field(
                              v-model="props.item.arrival_date"
                              mask="####-##-##"
                              name="arrival_date"
                              v-validate="'required'")
                        td
                            v-text-field(
                              v-model="props.item.expiry_date"
                              mask="####-##-##"
                              name="expiry_date"
                              v-validate="'required'")
                        td
                            v-checkbox.mt-3(
                              v-model="props.item.defected"
                              color="primary")
                v-layout
                  v-spacer
                  v-btn(
                    @click="submit"
                    :disabled="errors.items.length > 0"
                    flat color="primary") Добавить
</template>

<script>
import Warehouse from '@/services/Warehouse';
import Brand from '@/services/Brand';
import ProductType from '@/services/ProductType';
import Product from '@/services/Product';
import Stock from '@/services/Stock';

export default {
  name: 'Stock',
  data() {
    return {
      loading: false,
      brand: null,
      brands: [],
      type: null,
      types: [],
      query: '',
      warehouse: {
        owner: {},
      },
      products: [],
      selected: [],
      headers: [
        {
          text: 'Наименование',
          value: 'name',
        },
        {
          text: 'Фасовка',
          value: 'packing',
        },
        {
          text: 'Цвет',
          value: 'color',
        },
      ],
      selected_headers: [
        {
          text: 'Наименование',
          value: 'name',
          sortable: false,
        },
        {
          text: 'Фасовка',
          value: 'packing',
          sortable: false,
        },
        {
          text: 'Цвет',
          value: 'color',
          sortable: false,
        },
        {
          text: 'Количество',
          value: 'quantity',
          sortable: false,
          width: 100,
        },
        {
          text: 'Дата прибытия',
          value: 'arrival_date',
          sortable: false,
          width: 100,
        },
        {
          text: 'Срок действия',
          value: 'arrival_date',
          sortable: false,
          width: 100,
        },
        {
          text: 'Поврежден',
          value: 'defected',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    getAll() {
      Promise.all([
        Warehouse.get(this.$route.params.id),
        Brand.getAll(),
        ProductType.getAll(),
      ])
        .then((warehouse) => {
          [this.warehouse, this.brands, this.types] = warehouse;
        });
    },
    search() {
      if (this.query || this.brand || this.type) {
        this.loading = true;
        Product.search(this.query,
          this.brand ? this.brand.id : null,
          this.type ? this.type.id : null)
          .then((products) => { this.products = products; })
          .finally(() => { this.loading = false; });
      } else {
        this.products = [];
      }
    },
    submit() {
      const stocks = this.selected.map(element => ({
        productId: element.id,
        warehouseId: this.warehouse.id,
        quantity: element.quantity,
        defected: element.defected,
        arrival_date: element.arrival_date,
        expiry_date: element.expiry_date,
      }));
      Stock.createStocks(stocks)
        .then(() => this.$router.push({ name: 'warehouse' }))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        });
    },
    select(product) {
      const ids = this.selected.map(item => item.id);
      if (!ids.includes(product.id)) {
        const selection = product;
        selection.quantity = 0;
        selection.defected = false;
        selection.arrival_date = this.getCurrentDate();
        selection.expiry_date = this.getCurrentDate();
        this.selected.push(product);
      }
    },
    getCurrentDate() {
      const date = new Date();
      const day = (date.getDay() < 10 ? '0' : '') + date.getDay();
      const month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
      return `${date.getFullYear()}-${month}-${day}`;
    },
  },
  watch: {
    query() {
      this.search();
    },
    brand() {
      this.search();
    },
    type() {
      this.search();
    },
  },
  created() {
    this.getAll();
  },
};
</script>

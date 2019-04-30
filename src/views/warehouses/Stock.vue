<template lang="pug">
  v-layout(row wrap)
    v-flex(xs6)
      SearchProduct(v-model="product" :items="items")
      //.border.white.pa-4
        v-layout(row wrap)
          v-flex(xs12)
            .title Поиск товаров
          v-flex(xs6)
            v-combobox(
                v-model="brand"
                :items="brands"
                item-value="id"
                item-text="name"
                label="Бренд"
                clearable
                color="secondary"
            )
          v-flex(xs6)
            v-combobox(
                v-model="type"
                :items="types"
                item-value="id"
                item-text="name"
                label="Тип продукта"
                clearable
                color="secondary"
            )
          v-flex(xs12)
            v-text-field(
                v-model="query"
                label="Поиск"
                color="secondary"
            )
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
                        td {{ props.item.color || '-' }}

    v-flex(xs6)
      .border.white.pb-1
        .title.pa-4 Выбрано: {{ items.length }}
        v-data-table(
          v-if="items.length"
          :headers="selected_headers"
          :items="items"
          hide-actions)
          template(v-slot:items="props")
              td {{ props.item.product.name }}
              td {{ props.item.product.packing }}
              td {{ props.item.product.color || '-' }}
              td
                  v-text-field(
                    color="secondary"
                    v-model="props.item.quantity"
                    name="quantity"
                    v-validate="'required|decimal|min_value:0|is_not:0'")
              td
                  v-dialog(
                    v-model="props.item.arrival_date_modal"
                    full-width
                    width="290px"
                  )
                    template(v-slot:activator="{ on }")
                      v-text-field(
                        v-model="props.item.arrival_date"
                        readonly
                        v-on="on"
                      )
                    v-date-picker(
                      v-model="props.item.arrival_date"
                      no-title
                      @input="props.item.arrival_date_modal = false"
                      color="secondary"
                    )
              td
                  v-dialog(
                    v-model="props.item.expiry_date_modal"
                    full-width
                    width="290px"
                  )
                    template(v-slot:activator="{ on }")
                      v-text-field(
                        v-model="props.item.expiry_date"
                        readonly
                        v-on="on"
                      )
                    v-date-picker(
                      v-model="props.item.expiry_date"
                      no-title
                      @input="props.item.expiry_date_modal = false"
                      color="secondary"
                    )
              td
                  v-checkbox.mt-3(
                    v-model="props.item.defected"
                    color="secondary")
        v-layout
          v-spacer
          v-btn(
            @click="submit"
            :disabled="errors.items.length > 0 || items.length == 0"
            flat color="secondary") Добавить
</template>

<script>
import Stock from '@/services/Stock';

export default {
  name: 'Stock',
  data() {
    return {
      modal: false,
      loading: false,
      warehouse: {
        owner: {},
      },
      product: null,
      items: [],
      selected_headers: [
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
          sortable: false,
          width: 100,
        },
        {
          text: 'Дата прибытия',
          value: 'arrival_date',
          sortable: false,
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
    submit() {
      const stocks = this.items.map(element => ({
        productId: element.product.id,
        warehouseId: this.$route.params.id,
        quantity: element.quantity,
        defected: element.defected,
        arrival_date: element.arrival_date,
        expiry_date: element.expiry_date,
      }));
      Stock.createStocks(stocks)
        .then(() => this.$router.push({ name: 'information' }))
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        });
    },
    getCurrentDate() {
      const date = new Date();
      const day = (date.getDay() < 10 ? '0' : '') + date.getDay();
      const month = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
      return `${date.getFullYear()}-${month}-${day}`;
    },
  },
  watch: {
    product(product) {
      if (product) {
        const ids = this.items.map(item => item.product.id);
        if (!ids.includes(product.id)) {
          const item = {
            product,
            quantity: 1,
            defected: false,
            arrival_date: this.getCurrentDate(),
            expiry_date: this.getCurrentDate(),
          };
          this.items.push(item);
        }
      }
      this.product = null;
    },
  },
};
</script>

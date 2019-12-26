<template lang="pug">
  .border.white
    v-layout(wrap)
        v-spacer
        v-flex(xs4)
          v-text-field(
            v-model="search"
            label="Поиск"
            append-icon="search"
          ).ma-3
        v-flex(xs12)
            v-data-table(
                :headers="headers"
                disable-initial-sort
                :items="items"
                :search="search"
                no-data-text="Нет информации"
            )
                template(v-slot:items="{ item, index }")
                    tr
                      td {{ item.date | moment("HH:mm DD-MM-YYYY")}}
                      td {{ item.code }}
                      td {{ item.name }}
                      td {{ item.brand }}
                      td {{ item.manufacturer }}
                      td {{ item.color || '-' }}
                      td {{ item.packing }}
                      td {{ item.quantity }}
</template>

<script>
import Sale from '@/services/Sale';

export default {
  name: 'SalesHistory',
  data() {
    return {
      items: [],
      search: '',
      headers: [
        {
          text: 'Дата',
          value: 'date',
        },
        {
          text: 'Код',
          sortable: false,
          value: 'code',
        },
        {
          text: 'Наименование',
          value: 'name',
          invisible: true,
        },
        {
          text: 'Бренд',
          value: 'brand',
          invisible: true,
          width: 1,
        },
        {
          text: 'Производитель',
          value: 'manufacturer',
          width: 1,
        },
        {
          text: 'Цвет',
          value: 'color',
          width: 1,
        },
        {
          text: 'Фасовка',
          value: 'packing',
          width: 1,
        },
        {
          text: 'Количество',
          width: 1,
          sortable: false,
          value: 'quantity',
        },
      ],
    };
  },
  methods: {
    getAll() {
      Sale.getAllSaleItems().then((saleItems) => {
        saleItems.forEach((item) => {
          this.items.push({
            date: item.sale.createdAt,
            code: item.stock.product.code,
            name: item.stock.product.name,
            brand: item.stock.product.Brand.name,
            manufacturer: item.stock.product.Brand.manufacturer,
            color: item.stock.product.color,
            packing: item.stock.product.packing,
            quantity: item.quantity,
          });
        });
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

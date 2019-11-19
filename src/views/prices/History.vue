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
                            td {{ index+1 }}
                            td {{ item.date | moment("HH:mm DD-MM-YYYY")}}
                            td {{ item.brand }}
                            td {{ item.manufacturer }}
                            td {{ item.name }}
                            td {{ item.color || '-'}}
                            td {{ item.packing }}
                            td {{ item.mixPriceNonCash }}
                            td {{ item.secondPrice }}
                            td {{ item.b2c | ceil}}
                            td {{ item.mixPriceCash | roundUp}}
                            td {{ item.manager }}
                            td {{ item.quantityBefore }}
                            td {{ item.quantityAfter }}
</template>
<script>
import Price from '@/services/Price';

export default {
  data() {
    return {
      items: [],
      search: '',
      headers: [
        {
          text: '#',
          width: 1,
          invisible: true,
          sortable: false,
        },
        {
          text: 'Дата',
          sortable: false,
          value: 'date',
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
          text: 'Сотрудник',
          width: 1,
          sortable: false,
          value: 'manager',
        },
        {
          text: 'Количество до',
          width: 1,
          sortable: false,
          value: 'quantityBefore',
        },
        {
          text: 'Количество после',
          width: 1,
          sortable: false,
          value: 'quantityAfter',
        },
      ],
    };
  },
  methods: {
    getAll() {
      this.items = [];
      Price.getAllLogs().then((data) => {
        this.items = data.map(priceLog => ({
          id: priceLog.id,
          brand: priceLog.product.Brand.name,
          manufacturer: priceLog.product.Brand.manufacturer,
          name: priceLog.product.name,
          color: priceLog.product.color,
          packing: priceLog.product.packing,
          mixPriceNonCash: priceLog.price.mixPriceNonCash,
          secondPrice: priceLog.price.secondPrice,
          b2c: this.$b2c(priceLog.price, priceLog.officialRate, priceLog.exchangeRate),
          mixPriceCash: this.$priceCash(priceLog.price, priceLog.exchangeRate),
          manager: priceLog.user.name,
          date: priceLog.createdAt,
          quantityBefore: priceLog.quantityBefore,
          quantityAfter: priceLog.quantityAfter,
        })).sort((a, b) => (new Date(a.date)
          .getTime() > (new Date(b.date)).getTime() ? -1 : 1));
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

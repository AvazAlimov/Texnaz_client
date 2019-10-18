<template lang="pug">
    div
      .border.white.pa-2
          .title.ma-2 Учет товара
          v-data-table(
            :loading="loading"
            :headers="headers"
            :items="closedProducts"
          )
      .border.white.pa-2.mt-5
          .title.ma-2 История товара
          v-data-table(
            :loading="loading"
            :headers="headers"
            :items="notClosedProducts"
          )
</template>
<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    sales: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      headers: [
        {
          text: 'Код товара',
          value: 'product.code',
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
          text: 'Состояние',
          value: 'defected',
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
          text: 'Скидка %',
          value: 'discount',
          width: 1,
        },
        {
          text: 'Количество',
          value: 'quantity',
          width: 1,
        },
        {
          text: 'Цена',
          value: 'aprice',
          width: 1,
        },
        {
          text: 'Сумма',
          value: 'price',
          sortable: false,
          width: 1,
        },
      ],
    };
  },
  computed: {
    closedProducts() {
      return this.sales.filter(({ isClosed }) => isClosed === true);
    },
    notClosedProducts() {
      return this.sales.filter(({ isClosed }) => isClosed === false);
    },
  },
};
</script>

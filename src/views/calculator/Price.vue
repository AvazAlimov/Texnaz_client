<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'second_cost' }")
            v-icon arrow_back
        .title Цены

        v-flex.mt-3(xs12)
            Info(:batch="batch" :step="5")

        v-flex(xs12)
            .border.white
                .title.pa-4 Товары
                v-data-table(
                    :headers="headers"
                    :items="items"
                    no-data-text="Ничего не выбрано"
                    hide-actions)
                    template(v-slot:items="props")
                        PriceItem(:item="props.item" :batch="batch")
</template>

<script>
import Batch from '@/services/Batch';

export default {
  name: 'Price',
  data() {
    return {
      loading: false,
      batch: {
        expanses: [],
        items: [],
      },
      items: [],
      headers: [
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
          value: 'color',
          sortable: false,
        },
        {
          text: 'Цена №1 (БН)',
          value: 'price',
          sortable: false,
        },
        {
          text: 'Цена №2 (БН)',
          value: 'price',
          sortable: false,
        },
        {
          text: 'Цена №2 (Н)',
          value: 'price',
          sortable: false,
        },
        {
          text: 'Цена №3 (Н)',
          value: 'price',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    getAll() {
      Promise.all([
        Batch.get(this.$route.params.id),
      ]).then((results) => {
        [this.batch] = results;
        this.batch.items.forEach((item) => {
          this.items.push(item);
        });
      });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

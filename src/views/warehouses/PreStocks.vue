<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
            .border.white
                v-data-table(
                    :loading="loading"
                    :headers="headers"
                    :items="prestocks"
                    hide-actions
                )
                    template(v-slot:items="props")
                        PreStockItem(:index="props.index" :item="props.item")
                v-divider
                v-layout
                    v-spacer
                    v-btn.ma-0.mb-1.mr-1(
                        :loading="loading"
                        flat color="secondary"
                        @click="submit"
                    ) Завершить
</template>

<script>
import PreStock from '@/services/PreStock';

export default {
  name: 'PreStocks',
  data() {
    return {
      loading: false,
      headers: [
        {
          text: '#',
          value: '#',
          sortable: false,
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
          sortable: false,
        },
        {
          text: 'Принять',
          value: 'arrived',
          sortable: false,
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
      prestocks: [],
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.prestocks = [];
      Promise.all([
        PreStock.getByWarehouse(this.$route.params.id),
      ])
        .then((results) => {
          [this.prestocks] = results;
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    submit() {
      this.loading = true;
      const stocks = this.prestocks
        .filter(prestock => prestock.arrived <= prestock.quantity && prestock.arrived > 0);
      PreStock.acceptMultiple(stocks)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

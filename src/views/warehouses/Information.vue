<template lang="pug">
  v-layout(row wrap align-center)
    v-flex(xs12)
      .border.white
        v-data-table(:headers="headers" :items="stocks" hide-actions :loading="loading")
          template(v-slot:items="props")
            td {{ props.item.product.name }}
            td {{ props.item.product.packing }}
            td {{ props.item.product.color }}
            td {{ props.item.quantity }}
            td {{ props.item.arrival_date }}
            td {{ props.item.expiry_date }}
            td.text-xs-center
              v-icon(small) {{ props.item.defected ? 'check' : 'close' }}
</template>

<script>
import Stock from '@/services/Stock';

export default {
  name: 'Information',
  data() {
    return {
      headers: [
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
      stocks: [],
      loading: false,
    };
  },
  methods: {
    getAll() {
      this.loading = true;
      this.stocks = [];
      Stock.getByWarehouse(this.$route.params.id)
        .then((stocks) => { this.stocks = stocks; })
        .catch(() => this.getAll())
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

<style scoped>
</style>

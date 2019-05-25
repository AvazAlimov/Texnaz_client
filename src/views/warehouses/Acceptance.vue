<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
            .border.white
                v-data-table(
                    v-model="selected"
                    :headers="headers"
                    :items="moves"
                    select-all
                    hide-actions
                )
                    template(v-slot:items="props")
                        td
                          v-checkbox(v-model="props.selected" hide-details color="secondary")
                        td {{ props.item.stock.product.code || '-' }}
                        td {{ props.item.stock.product.Brand.name }}
                            |  {{ props.item.stock.product.name }}
                        td {{ props.item.stock.product.packing }}
                        td {{ props.item.stock.product.color || '-' }}
                        td {{ props.item.quantity }}
                        td {{ props.item.stock.defected ? 'Поврежден' : 'Хорошо' }}
                        td {{ props.item.stock.arrival_date | moment('YYYY-MM-DD') }}
                        td {{ props.item.stock.expiry_date | moment('YYYY-MM-DD') }}
                v-divider
                v-layout(row wrap)
                  v-spacer
                  v-btn.ma-0.mb-1.mr-1(
                    flat
                    color="secondary"
                    @click="submit()"
                    :loading="loading"
                    :disabled="!selected.length"
                  ) Завершить
</template>

<script>
import Move from '@/services/Move';

export default {
  name: 'Acceptance',
  data: () => ({
    loading: false,
    moves: [],
    selected: [],
    headers: [
      {
        text: 'Код товара',
        value: 'stock.product.code',
      },
      {
        text: 'Наименование',
        value: 'stock.product.name',
      },
      {
        text: 'Фасовка',
        value: 'stock.product.packing',
      },
      {
        text: 'Цвет',
        value: 'stock.product.color',
      },
      {
        text: 'Количество',
        value: 'quantity',
      },
      {
        text: 'Состояние',
        value: 'stock.product.defected',
      },
      {
        text: 'Дата прибытия',
        value: 'stock.arrival_date',
      },
      {
        text: 'Срок действия',
        value: 'stock.expiry_date',
      },
    ],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Move.getAllPending(this.$route.params.id)
        .then((moves) => {
          this.moves = moves;
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    submit() {
      this.loading = true;
      Move.acceptMultiple(this.selected)
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

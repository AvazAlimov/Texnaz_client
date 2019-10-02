<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
            .border.white
                v-data-table(
                    :headers="headers"
                    :items="moves"
                    hide-actions
                )
                    template(v-slot:items="props")
                      AcceptanceItem(:item="props.item")
                v-divider
                v-layout(row wrap)
                  v-spacer
                  v-btn.ma-0.mb-1.mr-1(
                    flat
                    color="secondary"
                    @click="submit()"
                    :loading="loading"
                    :disabled="errors.items.length > 0"
                  ) Завершить
</template>

<script>
import Move from '@/services/Move';

export default {
  name: 'Acceptance',
  data: () => ({
    loading: false,
    moves: [],
    headers: [
      {
        sortable: false,
      },
      {
        text: 'Наименование',
        value: 'stock.product.name',
      },
      {
        text: 'Код товара',
        value: 'stock.product.code',
        width: 1,
      },
      {
        text: 'Фасовка',
        value: 'stock.product.packing',
        width: 1,
      },
      {
        text: 'Цвет',
        value: 'stock.product.color',
        width: 1,
      },
      {
        text: 'Количество',
        value: 'quantity',
        width: 1,
      },
      {
        text: 'Состояние',
        value: 'stock.product.defected',
        width: 1,
      },
      {
        text: 'Дата прибытия',
        value: 'stock.arrival_date',
        width: 1,
      },
      {
        text: 'Срок действия',
        value: 'stock.expiry_date',
        width: 1,
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
      Promise.all([
        Move.acceptMultiple(this.moves),
      ])
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

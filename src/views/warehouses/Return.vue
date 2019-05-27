<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
            .border.white
                v-data-table(
                    :headers="headers"
                    :items="returns"
                    hide-actions
                )
                    template(v-slot:items="props")
                        ReturnItem(:item="props.item")
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
import Return from '@/services/Return';

export default {
  name: 'Return',
  data: () => ({
    loading: false,
    headers: [
      {
        sortable: false,
      },
      {
        text: 'Код товара',
        value: 'product.code',
        width: 1,
      },
      {
        text: 'Наименование',
        value: 'product.name',
      },
      {
        text: 'Фасовка',
        value: 'product.packing',
        width: 1,
      },
      {
        text: 'Цвет',
        value: 'product.color',
        width: 1,
      },
      {
        text: 'Количество',
        value: 'quantity',
        width: 1,
      },
      {
        text: 'Дата прибытия',
        value: 'arrival_date',
        width: 1,
      },
      {
        text: 'Срок действия',
        value: 'expiry_date',
        width: 1,
      },
      {
        text: 'Состояние',
        value: 'defected',
        width: 1,
      },
      {
        text: 'Возврат от',
        value: 'from',
        width: 1,
      },
      {
        text: 'Прием',
        value: 'quantity',
        width: 1,
      },
    ],
    returns: [],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Return.getAll(this.$route.params.id)
        .then((returns) => {
          this.returns = returns;
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    submit() {
      this.loading = true;
      Return.acceptMultiple(this.returns.filter(item => !!item.selected))
        .then(() => window.location.reload())
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

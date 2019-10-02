<template lang="pug">
  v-layout(row wrap)
    v-flex(xs12)
      .border.white
        v-data-table(
          :loading="loading"
          :headers="headers"
          :items="lostStocks"
          hide-actions)
          template(v-slot:items="props")
            td {{ props.item.stock.product.code || '-' }}
            td {{ props.item.stock.product.Brand.name }}
            td {{ props.item.stock.product.Brand.manufacturer || '-' }}
            td {{ props.item.stock.product.name }}
            td {{ props.item.stock.product.packing }}
            td {{ props.item.stock.product.color || '-' }}
            td {{ props.item.quantity }}
            td {{ props.item.quantity * props.item.stock.product.packing }}
            td
              v-text-field(
                v-model="props.item.Oquantity"
                :name="props.item.stock.product.code"
                v-validate="{\
                  required: true,\
                  numeric: true,\
                  max_value: props.item.quantity,\
                  excluded: '0',\
                  }"
              )
            td
              v-btn(icon
              flat
              color="green"
              :disabled="!!errors.items.find(el => el.field === props.item.stock.product.code) ||\
                props.item.Oquantity === 0"
              @click="submit(props.item)")
                v-icon(small) check
</template>

<script>
import Lost from '@/services/Lost';

export default {
  name: 'LostStocks',
  data: () => ({
    weight: '',
    loading: false,
    headers: [
      {
        text: 'Код',
        value: 'product.code',
      },
      {
        text: 'Бренд',
        value: 'product.Brand.name',
      },
      {
        text: 'Производитель',
        value: 'product.Brand.manufacturer',
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
      },
      {
        text: 'Вес',
        value: 'weight',
      },
      {
        text: 'Количество возврата',
        value: 'quantityReturn',
      },
      {
        sortable: false,
      },
    ],
    lostStocks: [],
  }),
  methods: {
    getAll() {
      this.loading = true;
      Lost.getAll(this.$route.params.id)
        .then((lostStocks) => {
          this.lostStocks = lostStocks;
          // eslint-disable-next-line no-param-reassign
          lostStocks.forEach((el) => { el.Oquantity = 0; });
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
    submit(item) {
      new Promise((resolve, reject) => {
        Lost.found({
          id: item.id,
          quantity: item.Oquantity,
        })
          .then(() => resolve())
          .catch(() => reject());
      }).then(() => { this.getAll(); })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

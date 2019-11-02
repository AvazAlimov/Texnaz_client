<template lang="pug">
  .white.border
    v-layout(row wrap v-if="price")
      v-flex(xs6)
        v-layout.ma-4(align-center)
          .subheading Бренд
          v-spacer
            v-divider.mx-4
          .subheading {{ price.product.Brand.name }}
        v-layout.ma-4(align-center)
          .subheading Производитель
          v-spacer
            v-divider.mx-4
          .subheading {{ price.product.Brand.manufacturer }}
        v-layout.ma-4(align-center)
          .subheading Наименование
          v-spacer
            v-divider.mx-4
          .subheading {{ price.product.name }}
        v-layout.ma-4(align-center)
          .subheading Цвет
          v-spacer
            v-divider.mx-4
          .subheading {{ price.product.color || '-' }}
        v-layout.ma-4(align-center)
          .subheading Фасовка
          v-spacer
            v-divider.mx-4
          .subheading {{ price.product.packing }}
        v-layout.ma-4(align-center)
          .subheading Единица
          v-spacer
            v-divider.mx-4
          .subheading {{ stock.product.typeUnit.name }}
        v-layout.ma-4(align-center)
          .subheading Количество
          v-spacer
            v-divider.mx-4
          .subheading {{ stock.quantity }}
      v-flex(xs6)
        v-layout.ma-4(align-center)
          .subheading B2C
          v-spacer
            v-divider.mx-4
          .subheading {{ $b2c(price, officialRate, exchangeRate) | ceil }} сум
        v-layout.ma-4(align-center)
          .subheading Наценка ($)
          v-spacer
            v-divider.mx-4
          .subheading {{ price.secondPrice - price.mixPriceNonCash / officialRate | roundUp }} $
        v-layout(row wrap)
          v-flex(xs5)
            v-text-field.ml-4.mr-2.my-0(
              color="secondary"
              label="Наценка (сум)"
              v-model="price.mixPriceNonCash"
              suffix="сум"
              name="Наценка (сум)"
              v-validate="{\
                required: true,\
                decimal: true,\
                min_value: 0,\
                excluded: '0'\
              }")
          v-flex(xs5)
            v-text-field.mr-4.ml-2.my-0(
              color="secondary"
              label="B2B"
              v-model="price.secondPrice"
              suffix="$"
              name="B2B"
              v-validate="{\
                required: true,\
                decimal: true,\
                min_value: 0,\
                excluded: '0'\
              }")
          v-flex(xs2)
            v-text-field.mr-4.ml-2.my-0(
              color="secondary"
              label="Количество"
              v-model="quantity"
              name="Quantity"
              v-validate="{\
                required: true,\
                decimal: true,\
              }")
        v-layout(row align-center)
          v-spacer
          v-btn.ma-0(
            :loading="loading"
            flat color="secondary"
            :disabled="errors.items.length > 0"
            @click="submit()"
          ) Сохранить
          v-btn.mr-4.my-4(
            flat color="secondary"
            :to="{ name: 'priced' }"
          ) Отменить
</template>

<script>
import Price from '@/services/Price';
import Stock from '@/services/Stock';
import Configuration from '@/services/Configuration';

export default {
  name: 'EditPrice',
  data: () => ({
    loading: true,
    stock: { product: { typeUnit: '' } },
    price: null,
    quantity: 0,
    exchangeRate: 1,
    officialRate: 1,
  }),
  methods: {
    getAll() {
      Promise.all([
        Price.get(this.$route.params.id),
        Configuration.getExchangeRate(),
        Configuration.getOfficialRate(),
      ])
        .then((results) => {
          [this.price] = results;
          Stock.getByProductId(this.price.productId).then((stock) => {
            [this.stock] = stock;
            this.exchangeRate = results[1].value;
            this.officialRate = results[2].value;
          });
        })
        .catch((error) => {
          this.$store.commit('setMessage', error.message);
        })
        .finally(() => { this.loading = false; });
    },
    submit() {
      this.loading = true;
      Price.createMultiple([{
        productId: this.price.product.id,
        firstPrice: this.price.firstPrice,
        mixPriceNonCash: this.price.mixPriceNonCash,
        mixPriceCash: this.price.mixPriceCash,
        secondPrice: this.price.secondPrice,
        quantity: this.quantity,
      }])
        .then(() => {
          this.$router.push({ name: 'priced' });
        })
        .catch(error => this.$store.commit('setMessage', error.message))
        .finally(() => { this.loading = false; });
    },
  },
  created() {
    this.getAll();
  },
};
</script>

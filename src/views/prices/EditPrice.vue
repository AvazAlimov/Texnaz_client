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
      v-flex(xs6)
        v-layout.ma-4(align-center)
          .subheading B2C
          v-spacer
            v-divider.mx-4
          .subheading {{ price.secondPrice * exchangeRate | ceil }} сум
        v-layout.ma-4(align-center)
          .subheading Наценка ($)
          v-spacer
            v-divider.mx-4
          .subheading {{ price.secondPrice - price.mixPriceNonCash / exchangeRate | roundUp }} $
        v-layout(row wrap)
          v-flex(xs6)
            v-text-field.ml-4.mr-2.my-0(
              color="secondary"
              label="Наценка (сум)"
              v-model="price.mixPriceNonCash"
              suffix="сум"
              name="Наценка (сум)"
              v-validate="'required|decimal|min_value:0'")
          v-flex(xs6)
            v-text-field.mr-4.ml-2.my-0(
              color="secondary"
              label="B2B"
              v-model="price.secondPrice"
              suffix="$"
              name="B2B"
              v-validate="'required|decimal|min_value:0'")
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
import Configuration from '@/services/Configuration';

export default {
  name: 'EditPrice',
  data: () => ({
    loading: true,
    price: null,
    exchangeRate: 1,
  }),
  methods: {
    getAll() {
      Promise.all([
        Price.get(this.$route.params.id),
        Configuration.getExchangeRate(),
      ])
        .then((results) => {
          [this.price] = results;
          this.exchangeRate = results[1].value;
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

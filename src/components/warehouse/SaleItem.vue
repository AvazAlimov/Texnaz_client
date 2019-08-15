<template lang="pug">
    tr
        td {{ item.product.code || '-' }}
        td {{ item.product.Brand.name }} {{ item.product.name }}
        td {{ item.product.packing }}
        td {{ item.product.color || '-' }}
        td {{ item.quantity - item.booked - item.sold }}
        td {{ item.defected ? 'Поврежден' : 'Хорошо' }}
        td {{ item.arrival_date | moment('YYYY-MM-DD') }}
        td {{ item.expiry_date | moment('YYYY-MM-DD') }}
        td
          span(v-if="type.id == 1") {{ productPrice.firstPrice | ceil }} сум
          span(v-if="type.id == 2") {{ productPrice.mixPriceNonCash | ceil }} сум
            |  - {{ productPrice.mixPriceCash | roundUp }}$
          span(v-if="type.id == 3") {{ productPrice.secondPrice | roundUp }}$
          v-text-field(
            v-if="type.id == 4"
            v-model="price"
            color="secondary"
            name="price"
            v-validate="{\
                    required: true,\
                    numeric: true,\
                    min_value: $b2c(item.product.prices[0], officialRate, exchangeRate),\
                }"
          )

        td
            v-text-field(
                color="secondary"
                v-model="discount"
                name="discount"
                v-validate="{\
                    required: true,\
                    numeric: true,\
                    min_value: 0,\
                    max_value: 100,\
                }"
            )
        td
            v-text-field(
                color="secondary"
                v-model="sale"
                :name="item.id"
                v-validate="{\
                    required: true,\
                    numeric: true,\
                    min_value: 0,\
                    excluded: '0',\
                    max_value: item.quantity - item.booked - item.sold\
                }"
            )
</template>
<script>
export default {
  name: 'SaleItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    exchangeRate: {
      required: true,
    },
    officialRate: {
      required: true,
    },
    type: {
      required: true,
    },
  },
  data: () => ({
    discount: 0,
    sale: 0,
    price: 0,
  }),
  computed: {
    productPrice() {
      return this.$price(this.item.product.prices[0],
        this.officialRate || 1, this.exchangeRate || 1);
    },
  },
  methods: {
    getB2b() {
      return this.$options.filters.ceil(this
        .$b2c(this.item.product.prices[0], this.officialRate, this.exchangeRate));
    },
    calculateFirstPrice() {
      this.item.firstPrice = this.getB2b()
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100);
      /*
      this.item.firstPrice = this.item.product.prices[0].secondPrice
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100);
                      * */
    },

    calculateMixPrice() {
      console.log((this.item.product.prices[0].secondPrice
                      - this.item.product.prices[0].mixPriceNonCash / this.exchangeRate
                      + this.item.product.prices[0].mixPriceCash));

      console.log((this.productPrice.secondPrice
                      - this.productPrice.mixPriceNonCash / this.exchangeRate
                      + this.productPrice.mixPriceCash));

      this.item.mixPrice = (this.item.product.prices[0].secondPrice
                      - this.item.product.prices[0].mixPriceNonCash / this.exchangeRate
                      + this.item.product.prices[0].mixPriceCash)
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100);
    },

    calculateSecondPrice() {
      this.item.secondPrice = this.item.product.prices[0].secondPrice
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100);
    },

    calculateComissionPrice() {
      this.item.commissionPrice = parseFloat(this.price) || 0;
      this.item.price = this.item.commissionPrice
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100)
                      / this.officialRate;
    },
  },
  watch: {
    discount(value) {
      this.item.discount = parseFloat(value) || 0;
      this.calculateFirstPrice();
      this.calculateSecondPrice();
      this.calculateMixPrice();
      this.calculateComissionPrice();
    },
    sale(value) {
      this.item.sale = parseFloat(value) || 0;
      this.calculateFirstPrice();
      this.calculateSecondPrice();
      this.calculateMixPrice();
      this.calculateComissionPrice();
    },
    price() {
      this.calculateComissionPrice();
    },
  },
  created() {
    if (!this.item.sale) this.item.sale = 0;
    if (!this.item.discount) this.item.discount = this.item.product.discount;
    this.discount = this.item.discount;
    this.sale = this.item.sale;
    this.calculateFirstPrice();
    this.calculateSecondPrice();
    this.calculateMixPrice();
    this.price = this.$options.filters.ceil(this.productPrice.firstPrice);
  },
  mounted() {
    this.$validator.validate();
  },
};
</script>

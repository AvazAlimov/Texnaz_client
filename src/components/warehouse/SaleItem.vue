<template lang="pug">
    tr
        td {{ item.product.code || '-' }}
        td {{ item.product.Brand.name }} {{ item.product.name }}
        td {{ item.product.packing }}
        td {{ item.product.color || '-' }}
        td {{ item.quantity - item.booked - item.sold }}
        td {{ item.product.typeUnit ? item.product.typeUnit.name : '-' }}
        td
          span(v-if="type.id == 1") {{ productPrice(item).firstPrice | ceil }} сум
          span(v-if="type.id == 2") {{ productPrice(item).mixPriceNonCash | ceil }} сум
            |  - {{ productPrice(item).mixPriceCash | roundUp }}$
          span(v-if="type.id == 3") {{ productPrice(item).secondPrice | roundUp }}$
          v-text-field(
            v-if="type.id == 4"
            v-model="price"
            color="secondary"
            name="price"
            v-validate="{\
                    required: true,\
                    decimal: true,\
                    min_value: 0,\
                }"
          )
          v-text-field(
            v-if="type.id == 5"
            v-model="priceUSD"
            color="secondary"
            name="priceUSD"
            v-validate="{\
                    required: true,\
                    decimal: true,\
                    min_value: 0,\
                }"
          )

        td
            v-text-field(
                color="secondary"
                v-model="discount"
                name="discount"
                v-validate="{\
                    required: true,\
                    decimal: true,\
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
                    decimal: true,\
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
    productPrice: {
      required: true,
    },
    getB2C: {
      required: true,
    },
    calculateFirstPrice: {
      required: true,
    },
    calculateMixPrice: {
      required: true,
    },
    calculateSecondPrice: {
      required: true,
    },
    calculateComissionPriceUsd: {
      required: true,
    },
    calculateComissionPrice: {
      required: true,
    },
    priceUzs: {
      required: true,
    },
    priceUsd: {
      required: true,
    },
  },
  data: () => ({
    discount: 0,
    sale: 0,
    price: 0,
    priceUSD: 0,
  }), /*
  computed: {
    productPrice() {
      return this.$price(this.item.product.prices[0],
        this.officialRate || 1, this.exchangeRate || 1);
    },
  },
  methods: {
    getB2C() {
      return this.$options.filters.ceil(this
        .$b2c(this.item.product.prices[0], this.officialRate, this.exchangeRate));
    },
    calculateFirstPrice() {
      this.item.firstPrice = this.getB2C()
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100);
    },

    calculateMixPrice() {
      this.item.mixPrice = this.$options.filters.ceil(this.productPrice.mixPriceNonCash)
                      / this.officialRate
                      * parseFloat(this.item.sale)
                      + this.$options.filters.roundUp(this.productPrice.mixPriceCash)
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100);
    },

    calculateSecondPrice() {
      this.item.secondPrice = this.item.product.prices[0].secondPrice
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100) || 0;
    },

    calculateComissionPriceUsd() {
      this.item.price = parseFloat(this.priceUSD) || 0;
      this.item.commissionPriceUsd = this.item.price
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100);
    },

    calculateComissionPrice() {
      this.item.commissionPrice = (this.price
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100));
    },
  }, */
  watch: {
    discount(value) {
      this.item.discount = parseFloat(value) || 0;
      this.calculateFirstPrice(this.item);
      this.calculateSecondPrice(this.item);
      this.calculateMixPrice(this.item);
      this.calculateComissionPrice(this.item);
      this.calculateComissionPriceUsd(this.item);
    },
    sale(value) {
      this.item.sale = parseFloat(value) || 0;
      this.calculateFirstPrice(this.item);
      this.calculateSecondPrice(this.item);
      this.calculateMixPrice(this.item);
      this.calculateComissionPrice(this.item);
      this.calculateComissionPriceUsd(this.item);
    },
    price(value) {
      this.calculateComissionPrice(this.item);
      this.priceUzs(value);
    },
    priceUSD(value) {
      this.calculateComissionPriceUsd(this.item);
      this.priceUsd(value);
    },
  },
  created() {
    if (!this.item.sale) this.item.sale = 0;
    if (!this.item.commissionPrice) this.item.commissionPrice = 0;
    if (!this.item.commissionPriceUsd) this.item.commissionPriceUsd = 0;
    if (!this.item.discount) this.item.discount = this.item.product.discount;
    this.discount = this.item.discount;
    this.sale = this.item.sale;
    this.calculateFirstPrice(this.item);
    this.calculateSecondPrice(this.item);
    this.calculateMixPrice(this.item);
    this.price = this.$options.filters.ceil(this.productPrice.firstPrice);
    this.priceUSD = this.item.product.prices[0].secondPrice;
    if (this.item.commissionPrice) this.price = this.item.commissionPrice / this.item.sale;
    if (this.item.commissionPriceUsd) this.priceUSD = this.item.commissionPriceUsd / this.item.sale;
  },
  mounted() {
    this.$validator.validate();
  },
};
</script>

<template lang="pug">
    tr
        td {{ item.product.code || '-' }}
        td {{ item.product.Brand.name }} {{ item.product.name }}
        td {{ item.product.packing }}
        td {{ item.product.color || '-' }}
        td {{ item.quantity - item.booked }}
        td {{ item.defected ? 'Поврежден' : 'Хорошо' }}
        td {{ item.arrival_date | moment('YYYY-MM-DD') }}
        td {{ item.expiry_date | moment('YYYY-MM-DD') }}
        td {{ item.product.prices[0].firstPrice }} сум
        td {{ item.product.prices[0].mixPriceNonCash }} сум
            |  / {{ item.product.prices[0].mixPriceCash }} $
        td {{ item.product.prices[0].secondPrice }} $
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
                    max_value: item.quantity - item.booked\
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
  },
  data: () => ({
    discount: 0,
    sale: 0,
  }),
  methods: {
    calculateFirstPrice() {
      this.item.firstPrice = this.item.product.prices[0].firstPrice
                      * parseFloat(this.item.sale)
                      * parseFloat((100 - this.item.discount) / 100);
    },
  },
  watch: {
    discount(value) {
      this.item.discount = parseFloat(value) || 0;
      this.calculateFirstPrice();
    },
    sale(value) {
      this.item.sale = parseFloat(value) || 0;
      this.calculateFirstPrice();
    },
  },
  created() {
    if (!this.item.sale) this.item.sale = 0;
    if (!this.item.discount) this.item.discount = this.item.product.discount;
    this.discount = this.item.discount;
    this.sale = this.item.sale;
    this.calculateFirstPrice();
  },
  mounted() {
    this.$validator.validate();
  },
};
</script>

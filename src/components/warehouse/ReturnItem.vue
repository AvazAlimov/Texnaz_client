<template lang="pug">
    tr
      td {{ item.stock.product.code }}
      td {{ item.stock.product.name }}
      td {{ item.stock.product.packing }}
      td {{ item.stock.product.color ? item.stock.product.color : '-' }}
      td {{ item.stock.defected ? 'поврежден' : 'хорошо' }}
      td {{ item.stock.arrival_date | moment('YYYY-MM-DD') }}
      td {{ item.stock.expiry_date | moment('YYYY-MM-DD') }}
      td {{ item.stock.product.discount }}
      td {{ getPrice(item) | roundUp | readable }}
      td {{ item.initial - (quantity > item.initial ? 0 : quantity) }}
      td
        v-text-field(
          type="number"
          v-model="quantity"
          :name="item.id"
          color="secondary"
          v-validate="{\
            required: true,\
            decimal: true,\
            min_value: 0,\
            max_value: item.initial,\
          }"
        )
</template>

<script>
export default {
  name: 'ReturnItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    form: {
      type: Number,
      required: true,
    },
    exchangeRate: {
      type: String,
      required: true,
    },
    officialRate: {
      type: String,
      required: true,
    },
    listener: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      quantity: 0,
    };
  },
  watch: {
    quantity(value) {
      this.item.quantity = this.item.initial - value;
      this.listener(value);
    },
  },
  methods: {
    getPrice(item) {
      switch (this.type) {
        case 1:
          return (this.$b2c(item.price, this.officialRate, this.exchangeRate)
                      * item.quantity
                      * (100 - item.discount) / 100)
                      / this.officialRate;
        case 2:
          return (item.price.mixPriceNonCash / this.exchangeRate
                      + item.price.mixPriceCash)
                      * item.quantity
                      * (100 - item.discount) / 100;
        case 3:
          return item.price.secondPrice
                      * item.quantity
                      * (100 - item.discount) / 100;
        case 4:
          return item.commissionPrice / this.exchangeRate
                  * item.quantity
                  * (100 - item.discount) / 100;
        default:
          return 0;
      }
    },
  },
};
</script>

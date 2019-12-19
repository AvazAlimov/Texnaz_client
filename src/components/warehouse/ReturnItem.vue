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
      td {{ getUsdPrice | roundUp | readable }}
      td {{ total }}
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
    quantityFromChild: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      quantity: 0,
      total: 0,
    };
  },
  watch: {
    quantity(value) {
      this.item.returnQuantity = value;
      this.total = this.item.initial - (value > this.item.initial
        ? 0 : value);
    },
  },
  computed: {
    getUsdPrice() {
      switch (this.type) {
        case 1:
          return this.item.debtPrice
              / Number.parseFloat(this.officialRate)
              / this.item.quantity
              * ((100 - this.item.discount) / 100);
        case 2:
          return this.item.debtPrice
              / Number.parseFloat(this.officialRate)
              / this.item.quantity
              * ((100 - this.item.discount) / 100);
        case 3:
          return this.item.price.secondPrice * ((100 - this.item.discount) / 100);
        case 4:
          return ((this.item.commissionPrice / Number.parseFloat(this.officialRate))
            / this.item.quantity)
            * ((100 - this.item.discount) / 100);
        case 5:
          return (this.item.commissionPriceUsd / this.item.quantity)
            * ((100 - this.item.discount) / 100);
        default:
          return 0;
      }
    },
  },
  created() {
    this.total = this.item.initial;
    this.quantity = this.item.returnQuantity;
  },
};
</script>

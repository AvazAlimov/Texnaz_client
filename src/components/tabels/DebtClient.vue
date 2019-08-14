<template lang="pug">
    tr
      td {{ user.clienticc }}
      td {{ user.clientname }}
      td {{ user.managername }}
      td {{ user.saleDate | moment('YYYY-MM-DD HH:mm')}}
      td {{ user.salePrice !== '-' ? readable(user.salePrice) : '-' }}
      td {{ user.paymentDate | moment('YYYY-MM-DD HH:mm')}}
      td {{ user.paymentPrice !== '-' ? readable(user.paymentPrice) : '-' }}
      td {{ user.returnDate | moment('YYYY-MM-DD HH:mm')}}
      td {{ user.returnQuantity }}
      td {{ user.clientbalance | roundUp | readable}}
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    readable(value) {
      return this.$options.filters.readable(this.$options.filters.roundUp(value));
    },
  },
};
</script>

<style>

</style>

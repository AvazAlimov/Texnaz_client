<template lang="pug">
    tr
      td {{ user.saleDate | moment('YYYY-MM-DD HH:mm')}}
      td {{ user.salePrice }}
      td {{ user.paymentDate | moment('YYYY-MM-DD HH:mm')}}
      td {{ user.paymentPrice }}
      td {{ user.returnDate | moment('YYYY-MM-DD HH:mm')}}
      td {{ user.returnQuantity }}
      td {{ user.clienticc }}
      td {{ user.clientname }}
      td {{ user.managername }}
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
};
</script>

<style>

</style>

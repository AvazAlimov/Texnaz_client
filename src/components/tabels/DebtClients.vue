<template lang="pug">
    tr
      td {{ user.icc }}
      td {{ user.name }}
      td {{ user.saleDate | moment('YYYY-MM-DD HH:mm')}}
      td {{ user.salePrice }}
      td {{ user.paymentDate | moment('YYYY-MM-DD HH:mm')}}
      td {{ user.paymentPrice }}
      td {{ user.manager }}
      td {{ user.debt }}
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

<template lang="pug">
    tr
      td {{ user.icc }}
      td {{ user.name }}
      td {{ user.saleDate | moment('YYYY-MM-DD HH:mm')}}
      td {{ user.salePrice }}
      td {{ user.manager }}
      td {{ user.daysLate }}
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

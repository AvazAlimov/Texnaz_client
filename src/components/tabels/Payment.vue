<template lang="pug">
  tr
    td {{ items.icc }}
    td {{ items.name }}
    td {{ items.manager }}
    td {{ items.date | moment('YYYY-MM-DD HH:mm')}}
    td {{ items.sum }}
    td {{ items.brand }}
    td {{ items.country }}
</template>

<script>
export default {
  props: {
    items: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>

</style>

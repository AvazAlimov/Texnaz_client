<template lang="pug">
    tr
        td {{ items.date | moment('YYYY-MM-DD HH:mm') }}
        td {{ items.name }}
        td {{ items.exchangeRate }}
        td {{ items.officialRate }}
        td {{ items.marketRate }}
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

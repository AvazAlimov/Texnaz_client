<template lang="pug">
    tr
        td {{ items.icc }}
        td {{ items.name }}
        td {{ items.date | moment('YYYY-MM-DD HH:mm')}}
        td {{ items.sum }}
        td {{ items.duration }}
        td {{ items.manager }}
        td {{ items.warehouse }}
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

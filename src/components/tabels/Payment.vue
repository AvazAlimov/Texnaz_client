<template lang="pug">
  tr
    td {{ items.number }}
    td {{ items.territory }}
    td {{ items.province }}
    td {{ items.icc }}
    td {{ items.name }}
    td {{ items.manager }}
    td {{ items.date | moment('YYYY-MM-DD')}}
    td {{ readable(items.sum) }}
    td {{ readable(items.sumbn) }}
    td {{ readable(items.ratioPrice) }}
    td {{ readable(items.usd) }}
    td {{ readable(items.exchangeRate) }}
    td
      v-layout
        v-tooltip(top v-if="items.comment.length")
          template(v-slot:activator="{ on }")
            v-btn(icon v-on="on").ma-0
              v-icon(color="secondary" small) message
          span {{ items.comment }}
</template>

<script>
export default {
  props: {
    items: {
      type: Object,
      required: true,
    },
  },
  methods: {
    readable(value) {
      return value === '-' ? '-' : this.$options.filters.readable(
        this.$options.filters.roundUp(Number(value)),
      );
    },
  },
};
</script>

<style>

</style>

<template lang="pug">
    v-list.pa-0.border(three-line)
        v-list-tile(:to="to" :click="click")
            v-list-tile-content
                v-list-tile-title.secondary--text {{ title }}
                v-list-tile-sub-title.secondary--text.text--lighten-1 {{ subtitle }}
                v-list-tile-sub-title.secondary--text.text--lighten-1 {{ caption }}
            v-list-tile-action
                v-icon(large color="secondary") {{ icon }}
</template>

<script>
export default {
  name: 'Card',
  props: {
    to: {
      type: Object,
    },
    click: {
      type: Function,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    caption: {
      type: String,
    },
    icon: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>

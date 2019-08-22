<template lang="pug">
    v-list.pa-2.border.white(three-line)
        v-list-tile(:to="to" @click="click ? click() : null")
            v-list-tile-content
                v-list-tile-title.secondary--text {{ title }}
                v-list-tile-sub-title.secondary--text.text--lighten-1 {{ subtitle }}
                v-list-tile-sub-title.secondary--text.text--lighten-1 {{ caption }}
                v-list-tile-sub-title.secondary--text.text--lighten-1 {{ heading ? heading : '' }}
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
    heading: {
      type: String,
      required: false,
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

<template lang="pug">
  v-app
    router-view
    v-snackbar(v-model="snackbar" color="white")
      .black--text {{ text }}
</template>

<script>
import store from '@/store';

export default {
  name: 'App',
  data() {
    return {
      snackbar: false,
    };
  },
  computed: {
    text: () => store.state.message,
  },
  watch: {
    text() {
      this.snackbar = true;
    },
  },
};
</script>
<style>
  .border {
     border: 1px solid rgba(0,0,0,0.12) !important;
  }
</style>

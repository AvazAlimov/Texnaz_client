<template lang="pug">
    router-view
</template>

<script>
export default {
  name: 'Batch',
  data() {
    return {
      step: 0,
    };
  },
};
</script>

<style scoped>
    .border {
        box-shadow: none
    }
</style>

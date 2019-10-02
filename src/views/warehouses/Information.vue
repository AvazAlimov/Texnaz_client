<template lang="pug">
  v-layout(row wrap align-center)
    v-flex(xs12)
      .border.white
        SearchStock(:warehouseId="$route.params.id" :items="[]" readOnly)
</template>

<script>
export default {
  name: 'Information',
};
</script>

<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12)
            .border
                SearchStock(v-model="stock" :warehouseId="$route.params.id" :items="selected")
</template>

<script>
export default {
  name: 'Move',
  data: () => ({
    stock: null,
    selected: [],
  }),
//   watch: {
//     stock(value) {
//       if (value) {
//         // this.selected.push(value);
//         this.stock = null;
//       }
//     },
//   },
};
</script>

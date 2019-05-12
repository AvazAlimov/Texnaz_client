<template lang="pug">
    v-layout(row wrap)
        v-flex(xs12).mb-3
            .title ЦЕНЫ
        v-flex(xs12)
            .border.white
                PricesTable
</template>

<script>
export default {
  name: 'Prices',
};
</script>

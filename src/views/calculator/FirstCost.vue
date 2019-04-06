<template lang="pug">
    v-layout(row wrap align-center)
        v-btn(icon :to="{ name: 'customs_expanses' }")
            v-icon arrow_back
        .title Учетная себестоимость
        v-spacer
        .title 5/6
</template>

<script>
export default {
  name: 'FirstCost',
};
</script>

<style>

</style>

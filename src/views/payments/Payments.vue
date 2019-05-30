<template lang="pug">
    div
        v-layout(row wrap v-if="$route.name == 'payments'")
            v-flex(xs12).mb-3
                .title ОПЛАТЫ
        router-view
</template>

<script>
export default {
  name: 'Payments',
};
</script>

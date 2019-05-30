<template lang="pug">
    div
        v-layout(row wrap v-if="$route.name == 'shipments'")
            v-flex(xs12).mb-3
                .title ОТГРУЗКИ
        router-view
</template>

<script>
export default {
  name: 'Shipments',
};
</script>

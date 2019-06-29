<template lang="pug">
    .border.white.pa-4.text-xs-center.secondary--text
        .title {{ title }}
        .display-2.my-4 {{ rate }}
        v-layout(justify-center align-center)
            v-icon(small) {{ parseFloat(delta) > 0 ? 'arrow_upward' : 'arrow_downward' }}
            .title {{ Math.abs(parseFloat(delta)) }} %
</template>

<script>
export default {
  name: 'RateCard',
  props: ['title', 'rate', 'delta'],
};
</script>

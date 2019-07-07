<template lang="pug"> 
    div(:style="`border: 1px solid ${colorBorder}; background: ${colorCard}`").pa-4.text-xs-center.dashboardTertiary--text
        .title {{ title }}
        .display-2.my-4.accent--text.font-weight-light {{ rate }}
        v-layout(justify-center align-center)
            v-icon(small).dashboardTertiary--text {{ parseFloat(delta) > 0 ? 'arrow_upward' : 'arrow_downward' }}
            .title {{ Math.abs(parseFloat(delta)) }} %
</template>

<script>
export default {
  name: 'RateCard',
  props: ['title', 'rate', 'delta', 'colorBorder', 'colorCard'],
};
</script>
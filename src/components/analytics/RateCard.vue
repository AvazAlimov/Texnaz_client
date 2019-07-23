<template lang="pug">
    .pa-4.text-xs-center.dashboardTertiary--text(
      :style="`border: 1px solid ${colorBorder}; background: ${colorCard}`"
    )
        .title {{ title }}
        .display-2.my-4.accent--text.font-weight-light {{ Number(rate) ? `$ ${$options.filters.roundUp(rate)}` : rate}}
        v-layout(justify-center align-center)
            v-icon.dashboardTertiary--text(
              small
            ) {{ parseFloat(delta) > 0 ? 'arrow_upward' : 'arrow_downward' }}
            .title {{ Math.abs(parseFloat(delta)) }} %
</template>

<script>
export default {
  name: 'RateCard',
  props: ['title', 'rate', 'delta', 'colorBorder', 'colorCard'],
};
</script>

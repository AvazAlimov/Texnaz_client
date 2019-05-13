<template lang="pug">
    v-layout(justify-center row wrap)
      v-flex(xs12)
        .border.white.pa-4
          v-layout(row wrap align-center)
            v-flex(xs6)
              .headline Областьи
              br
              .subheading(v-for="(region, index) in map") {{ index + 1 }}. {{ region.title }}
                v-divider(v-if="index < 13")
            v-flex(xs6).text-xs-center
              svg(width="400" height="260")
                g(transform="scale(0.5)" alignment-baseline="center")
                  path.region(v-for="region in map"
                      :d="region.d"
                      :title="region.title"
                      :id="region.id"
                      fill="#424242"
                      stroke="#FFFFFF"
                      stroke-width="1"
                      @mouseover="show(region.title, $event)"
                      @mouseleave="title=null"
                  )
              .tooltip.white.border.pa-2(ref="tooltip" v-show="title") {{ title }}
</template>

<script>
import uzbekistan from '../../assets/uzbekistan.json';

export default {
  name: 'Analytics',
  data() {
    return {
      title: null,
      map: uzbekistan,
    };
  },
  methods: {
    show(title, event) {
      const { tooltip } = this.$refs;
      tooltip.style.left = `${event.layerX}px`;
      tooltip.style.top = `${event.layerY}px`;
      this.title = title;
    },
  },
};
</script>

<style>
.region:hover {
  fill: #707070;
  z-index: 10;
}
.tooltip {
    position: absolute;
    object-fit: fill;
}
</style>
